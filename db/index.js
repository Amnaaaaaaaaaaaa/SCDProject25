const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');

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
module.exports = { addRecord, listRecords, updateRecord, deleteRecord, searchRecords, sortRecords };
