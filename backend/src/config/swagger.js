import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIREN API Documentation',
      version: '1.0.0',
      description: 'Smart Integrated Rescue & Emergency Network - RESTful API',
      contact: {
        name: 'SIREN Team',
        email: 'support@siren.app'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: 'https://api.siren.app',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['victim', 'volunteer', 'official', 'donor'] },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        },
        Request: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            victimName: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            coordinates: {
              type: 'object',
              properties: {
                lat: { type: 'number' },
                lng: { type: 'number' }
              }
            },
            emergencyType: { type: 'string' },
            description: { type: 'string' },
            severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            status: { type: 'string', enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'] },
            assignedVolunteer: { type: 'object' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

export default specs;
