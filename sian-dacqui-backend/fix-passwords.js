const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'J€b_1ncu!at0r4532',
  database: 'sian_dacqui_db',
});

async function fixPasswords() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Get users with null password_hash
    const usersWithoutHash = await dataSource.query(
      'SELECT id, email FROM "user" WHERE password_hash IS NULL'
    );

    console.log(`Found ${usersWithoutHash.length} users without password_hash`);

    for (const user of usersWithoutHash) {
      // Use a temporary password based on email for uniqueness
      const tempPassword = `temp_${user.email.split('@')[0]}_123`;
      const hash = await bcrypt.hash(tempPassword, 12);
      
      await dataSource.query(
        'UPDATE "user" SET password_hash = $1, must_change_password = $2 WHERE id = $3',
        [hash, true, user.id]
      );
      
      console.log(`✅ Updated user ${user.email} (temp password: ${tempPassword})`);
    }

    console.log('✅ All passwords fixed!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixPasswords();
