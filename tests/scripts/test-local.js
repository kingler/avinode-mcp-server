const { AvainodeTools } = require('./dist/avainode-tools.js');

async function test() {
  const tools = new AvainodeTools();
  
  try {
    const result = await tools.handleToolCall({
      params: {
        name: 'get-operator-info',
        arguments: { operatorId: 'OP001' }
      }
    });
    
    console.log('Success:', result.content[0].text.substring(0, 100));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();