import express, { Request, Response } from 'express';
import { google } from 'googleapis';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.post('/', async (req: Request, res: Response) => {
    const { request, name } = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    // Create client instance for auth
    const client = await auth.getClient()

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: 'v4', auth: client })

    const spreadsheetId = '1qjeC5-YI7xlTDUsbOrz0p484btsgqZ5PcFBJjG-MU6U'

    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })

    // Read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"
    })

    // Write row(s) to spreadsheet
    // @ts-ignore
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[request, name]],
        },
    });

    res.send("Successfully submitted! Thank you!");
});

app.listen(3000, () => console.log('listening to port 3000'))