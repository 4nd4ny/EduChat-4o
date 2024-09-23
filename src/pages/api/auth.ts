import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const AUTH_DURATION = 45 * 60 * 1000; // 45 minutes in milliseconds
const A24H_DURATION = 24 * 60 * 60 * 1000; // One day in milliseconds
const LOCK_FILE_PATH = path.join(process.cwd(), 'auth_lock.json'); 

function logAttempt(req: NextApiRequest, password: string, success: boolean) {
  const now = new Date();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const logEntry = `${now.toISOString()} | IP: ${ip} | Password: ${password} | Success: ${success}\n`;
  const logFilePath = path.join(process.cwd(), 'auth_log.txt');
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}
 
function checkAuthLock(): boolean {
  try {
    if (fs.existsSync(LOCK_FILE_PATH)) {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE_PATH, 'utf8'));
      if (Date.now() < lockData.timestamp) {
        return true;
      } else {
        console.error("Please login");
      }
    }
  } catch (error) {
    console.error('Error checking auth lock:', error);
  }
  return false;
}

function setAuthLock(duration: number) {
  try {
    fs.writeFileSync(LOCK_FILE_PATH, JSON.stringify({ timestamp: Date.now() + duration }));
  } catch (error) {
    console.error('Error setting auth lock:', error);
  }
} 

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  /* Autologin mode */
  if (checkAuthLock()) {
    logAttempt(req, 'AutoAuth', true);
    res.status(200).json({ success: true, message: 'Authorized (Auto)' });
    console.error("Autologin enable");
    return;
  }
  /* Password mode */
  if (req.method === 'POST') {
    const { password } = req.body;
    const envPassword = process.env.REACT_APP_PASSWD;
    
    if (envPassword === undefined) {
      console.error('REACT_APP_PASSWD n\'est pas défini');
      res.status(500).json({ success: false, message: 'Erreur de configuration du serveur' });
      return;
    }
    
    const isCorrect = password === envPassword;
    const isDouble = password === envPassword.repeat(2);

    if (isCorrect) {
      logAttempt(req, 'CorrectPwd', isCorrect);
      setAuthLock(AUTH_DURATION);
      res.status(200).json({ success: true, message: 'Authorized' });
    } else if (isDouble) {
      logAttempt(req, 'DoublePwd', isDouble);
      setAuthLock(A24H_DURATION);
      res.status(200).json({ success: true, message: 'Authorized' });
    } else {
      logAttempt(req, password, isCorrect);
      res.status(401).json({ success: false, message: 'Incorrect password' });
    }
  } 
  else if (req.method === 'GET') {
    res.status(200).json({ authorized: false }); 
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}