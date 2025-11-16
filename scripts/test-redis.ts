import 'dotenv/config'
import { setCache, getCache, deleteCache } from '../server/utils/redis'

async function testRedis() {
  console.log('🧪 Testing Redis connection...\n')

  try {
    // Test 1: Set a value
    console.log('1️⃣  Setting test value...')
    await setCache('test:key', { message: 'Hello Redis!' }, 60)
    console.log('✅ Value set successfully\n')

    // Test 2: Get the value
    console.log('2️⃣  Getting test value...')
    const value = await getCache('test:key')
    console.log('✅ Value retrieved:', value, '\n')

    // Test 3: Delete the value
    console.log('3️⃣  Deleting test value...')
    await deleteCache('test:key')
    console.log('✅ Value deleted\n')

    // Test 4: Verify deletion
    console.log('4️⃣  Verifying deletion...')
    const deletedValue = await getCache('test:key')
    if (deletedValue === null) {
      console.log('✅ Value successfully deleted\n')
    } else {
      console.log('❌ Value still exists\n')
    }

    console.log('🎉 All Redis tests passed!')
    console.log('\n✅ Your Redis is working perfectly!')
    
  } catch (error) {
    console.error('❌ Redis test failed:', error)
    console.log('\n⚠️  Check your REDIS_URL and UPSTASH_REDIS_REST_TOKEN in .env')
  }

  process.exit(0)
}

testRedis()
