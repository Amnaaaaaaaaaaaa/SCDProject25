const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');
const fs = require('fs');
const path = require('path');


function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const newRecord = { 
    id: recordUtils.generateId(), 
    name, 
    value,
    createdAt: new Date().toISOString()  // ADD THIS
  };
  data.push(newRecord);
  fileDB.writeDB(data);
  
  // CREATE BACKUP AFTER ADD
  createBackup(data);
  
  vaultEvents.emit('recordAdded', newRecord);
  return newRecord;
}

function listRecords() {
  return fileDB.readDB();
}

function updateRecord(id, newName, newValue) {
  const data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  fileDB.writeDB(data);
  vaultEvents.emit('recordUpdated', record);
  return record;
}

function deleteRecord(id) {
  let data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  fileDB.writeDB(data);
  
  // CREATE BACKUP AFTER DELETE
  createBackup(data);
  
  vaultEvents.emit('recordDeleted', record);
  return record;
}

function searchRecords(keyword) {
  const data = fileDB.readDB();
  const lowerKeyword = keyword.toLowerCase();
  
  return data.filter(record => {
    // Check if any word in name starts with keyword
    const nameWords = record.name.toLowerCase().split(' ');
    const nameMatch = nameWords.some(word => word.startsWith(lowerKeyword));
    
    // Check ID match
    const idMatch = record.id.toString().includes(keyword);
    
    return nameMatch || idMatch;
  });
}
// Sort functionality
function sortRecords(field, order) {
  const data = [...fileDB.readDB()]; // Create copy to avoid modifying original
  
  if (field === '1') {
    // Sort by name
    data.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === '1' ? comparison : -comparison;
    });
  } else if (field === '2') {
    // Sort by creation date
    data.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      const comparison = dateA - dateB;
      return order === '1' ? comparison : -comparison;
    });
  }
  
  return data;
}
// Export functionality (add before module.exports)
function exportData() {
  const data = fileDB.readDB();
  const now = new Date();
  const timestamp = now.toLocaleString();
  
  let content = '====================================\n';
  content += 'VAULT DATA EXPORT\n';
  content += '====================================\n';
  content += `Export Date: ${timestamp}\n`;
  content += `Total Records: ${data.length}\n`;
  content += `File Name: export.txt\n`;
  content += '====================================\n\n';
  
  if (data.length === 0) {
    content += 'No records to export.\n';
  } else {
    data.forEach((record, index) => {
      content += `Record ${index + 1}:\n`;
      content += '-----------------\n';
      content += `ID: ${record.id}\n`;
      content += `Name: ${record.name}\n`;
      content += `Value: ${record.value}\n`;
      content += `Created: ${record.createdAt || 'N/A'}\n`;
      content += '\n';
    });
  }
  
  const exportPath = path.join(__dirname, '..', 'export.txt');
  fs.writeFileSync(exportPath, content);
}

// Create backups directory
const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir);
}

// Automatic backup function
function createBackup(data) {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');
  
  const filename = `backup_${timestamp}.json`;
  const filepath = path.join(backupsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✓ Backup created: ${filename}`);
}
module.exports = { addRecord, listRecords, updateRecord, deleteRecord, searchRecords, sortRecords,exportData };
