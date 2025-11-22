const readline = require('readline');
const db = require('./db');
require('./events/logger'); // Initialize event logger

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records 
6. Sort Records       // ADD THIS
7. Exit 
=====================
  `);

  rl.question('Choose option: ', ans => {
    switch (ans.trim()) {
      case '1':
        rl.question('Enter name: ', name => {
          rl.question('Enter value: ', value => {
            db.addRecord({ name, value });
            console.log('✅ Record added successfully!');
            menu();
          });
        });
        break;

      case '2':
         const records = db.listRecords();
        if (records.length === 0) console.log('No records found.');
        else records.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name} | Value: ${r.value} | Created: ${r.createdAt || 'N/A'}`));
        menu();
        break;
      case '3':
        rl.question('Enter record ID to update: ', id => {
          rl.question('New name: ', name => {
            rl.question('New value: ', value => {
              const updated = db.updateRecord(Number(id), name, value);
              console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
              menu();
            });
          });
        });
        break;

      case '4':
        rl.question('Enter record ID to delete: ', id => {
          const deleted = db.deleteRecord(Number(id));
          console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
          menu();
        });
        break;
      case '5':
        // Search functionality
        rl.question('Enter search keyword: ', keyword => {
          const results = db.searchRecords(keyword);
          if (results.length === 0) {
            console.log('\nNo records found.');
          } else {
            console.log(`\nFound ${results.length} matching record(s):`);
            results.forEach((r, idx) => {
              const createdDate = r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : 'N/A';
              console.log(`${idx + 1}. ID: ${r.id} | Name: ${r.name} | Created: ${createdDate}`);
            });
          }
          menu();
        });
        break;
     case '6':
        // Sort functionality
        console.log('\n1. Sort by Name');
        console.log('2. Sort by Creation Date');
        rl.question('Choose field (1/2): ', field => {
          console.log('1. Ascending');
          console.log('2. Descending');
          rl.question('Choose order (1/2): ', order => {
            const sortedRecords = db.sortRecords(field, order);
            console.log('\n=== Sorted Records ===');
            sortedRecords.forEach((r, idx) => {
              console.log(`${idx + 1}. ID: ${r.id} | Name: ${r.name} | Value: ${r.value}`);
            });
            menu();
          });
        });
        break;
      case '7':
        console.log('👋 Exiting NodeVault...');
        rl.close();
        break;

      default:
        console.log('Invalid option.');
        menu();
    }
  });
}

menu();
