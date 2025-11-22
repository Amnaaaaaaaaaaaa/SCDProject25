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
module.exports = { addRecord, listRecords, updateRecord, deleteRecord, searchRecords };
