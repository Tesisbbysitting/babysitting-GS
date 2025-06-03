import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');
const SPREADSHEET_ID = '1EnUCen0d2Sqag17tg_XxPCU-vCSPUPSm4p_ut8AUFmw'; // Reemplazá esto por el ID real de tu Google Sheet

function getAuth() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: SCOPES,
  });
}

export async function getBabysitters() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'Babysitters!A2:N'; // A-N, 14 columnas
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  const rows = res.data.values || [];
  return rows.map(row => ({
    id: row[0],
    nombre: row[1],
    edad: row[2],
    foto: row[3],
    zona: row[4],
    rating: row[5],
    disponibilidad: row[6],
    universidad: row[7],
    carrera: row[8],
    experiencia: row[9],
    descripcion: row[10],
    hobbies: row[11] ? row[11].split(',').map((h: string) => h.trim()) : [],
    precioPorHora: row[12],
    contadorReservas: row[13],
  }));
}

export async function getComentarios(babysitterId: string) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'Comentarios!A2:E'; // A-E, 5 columnas
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  const rows = res.data.values || [];
  return rows
    .filter(row => row[0] === babysitterId)
    .map(row => ({
      babysitterId: row[0],
      nombre: row[1],
      fecha: row[2],
      rating: row[3],
      texto: row[4],
    }));
} 