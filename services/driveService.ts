/**
 * Service to handle Google Drive API interactions.
 * Requires 'https://apis.google.com/js/api.js' and 'https://accounts.google.com/gsi/client'
 */

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

// Scopes required to create files
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export const initGoogleDrive = (clientId: string, onInitComplete: () => void) => {
  if (!clientId) return;

  const gapi = (window as any).gapi;
  const google = (window as any).google;

  if (!gapi || !google) {
    console.warn("Google Scripts not loaded yet");
    return;
  }

  // 1. Initialize GAPI client (for making API calls)
  gapi.load('client', async () => {
    await gapi.client.init({
      // We don't strictly need API key for Drive if using OAuth, but useful for some calls.
      // Discovery docs tell GAPI how to interact with Drive
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    });
    gapiInited = true;
    if (gisInited) onInitComplete();
  });

  // 2. Initialize GIS client (for Auth)
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: '', // Defined at request time
  });
  gisInited = true;
  if (gapiInited) onInitComplete();
};

export const saveToGoogleDrive = async (title: string, content: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      return reject(new Error("Google Drive not initialized. Please check your Client ID in Settings."));
    }

    // Request an access token
    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        reject(resp);
      }
      
      // Create File
      try {
        const gapi = (window as any).gapi;
        
        // Metadata
        const fileMetadata = {
          name: `Daily Riff: ${title}`,
          mimeType: 'application/vnd.google-apps.document', // Save as Google Doc
        };

        // We use the multipart upload to create a file with content
        // However, creating a native Google Doc from text is tricky via simple upload.
        // Easiest robust way: Create a text file, or convert.
        // Let's simply create a Google Doc. To set content for a Google Doc via API v3 
        // often requires creating an empty file then updating it, OR uploading text/plain and asking Drive to convert.
        
        // Strategy: Upload as text/plain, convert to Google Doc
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const contentType = 'application/json';
        
        // We will save as a Google Doc by uploading HTML/Text and asking for import
        const metadata = {
          name: title,
          mimeType: 'application/vnd.google-apps.document'
        };

        const multipartRequestBody =
            delimiter +
            'Content-Type: ' + contentType + '\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: text/plain\r\n\r\n' +
            content +
            close_delim;

        const request = gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
              'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });

        const result = await request;
        resolve(result.result.id);
      } catch (err) {
        reject(err);
      }
    };

    // Trigger the auth flow
    // prompt: '' ensures we don't force re-login if already consented
    tokenClient.requestAccessToken({ prompt: '' });
  });
};
