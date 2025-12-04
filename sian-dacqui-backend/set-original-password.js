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

async function setOriginalPassword() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    const originalPassword = 'mdp123temp';
    const hash = await bcrypt.hash(originalPassword, 12);
    
    // Update all users with the original password
    const result = await dataSource.query(
      'UPDATE "user" SET password_hash = $1, must_change_password = $2',
      [hash, true]
    );

    console.log(`✅ Updated ${result[1]} users with original password: ${originalPassword}`);
    console.log('✅ All users now have must_change_password = true');
    
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setOriginalPassword();
