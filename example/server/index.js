require('dotenv').config()
const fetch = require('node-fetch');
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

async function build() {
  await fastify.register(require('middie'))
  // do you know we also have cors support?
  // https://github.com/fastify/fastify-cors
  fastify.use(require('cors')())
  return fastify
}

// Declare a route
fastify.post('/github_access_token', async (request, reply) => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    body: JSON.stringify(request.body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });
  const responseText = await response.json();
  return responseText;
})

fastify.get('/health-check', (request, reply) => {
  return { status: 'good' }
})

// Run the server!
const start = async () => {
  try {
    await build();
    await fastify.listen(process.env.PORT, '0.0.0.0')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();
