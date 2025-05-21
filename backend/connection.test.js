const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { makeNewConnection } = require('../connection');
process.env.MONGO_URI = "mongodb://localhost:27017/test";

jest.mock('mongoose'); // Mock mongoose module

dotenv.config();

describe('makeNewConnection', () => {
  let mockConnection;

  beforeAll(() => {
    // Mock the connection creation
    mockConnection = {
      on: jest.fn(),
      once: jest.fn(),
      close: jest.fn(),
    };
    mongoose.createConnection.mockReturnValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new connection with the correct URL', () => {
    const dbUrl = 'mongodb://localhost:27017/testDB';
    
    // Call the function with a fake URL
    const connection = makeNewConnection(dbUrl);

    // Check if mongoose.createConnection was called with the correct URL
    expect(mongoose.createConnection).toHaveBeenCalledWith(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    expect(connection).toBe(mockConnection); // Check if the returned connection is the mock connection
  });

  it('should log an error and terminate if MONGO_URI is not set', () => {
    const originalExit = process.exit; // Preserve original process.exit
    process.exit = jest.fn(); // Mock exit function

    // Call with no URL
    makeNewConnection();

    expect(console.error).toHaveBeenCalledWith("MONGO_URI is not set in the environment variables.");
    expect(process.exit).toHaveBeenCalledWith(1); // Ensure the process exits

    process.exit = originalExit; // Restore process.exit after the test
  });

  it('should log the connection success message', () => {
    const dbUrl = 'mongodb://localhost:27017/testDB';
    const connection = makeNewConnection(dbUrl);

    // Simulate the 'connected' event
    connection.on.mock.calls.forEach((call) => {
      if (call[0] === 'connected') call[1]();
    });

    expect(console.log).toHaveBeenCalledWith('MongoDB :: connected :: testDB');
  });

  it('should log the disconnection message', () => {
    const dbUrl = 'mongodb://localhost:27017/testDB';
    const connection = makeNewConnection(dbUrl);

    // Simulate the 'disconnected' event
    connection.on.mock.calls.forEach((call) => {
      if (call[0] === 'disconnected') call[1]();
    });

    expect(console.log).toHaveBeenCalledWith('MongoDB :: disconnected');
  });

  it('should handle mongoose errors', () => {
    const dbUrl = 'mongodb://localhost:27017/testDB';
    const connection = makeNewConnection(dbUrl);

    // Simulate the 'error' event
    mongoose.connection.emit('error', new Error('Test error'));

    expect(console.log).toHaveBeenCalledWith(new Error('Test error'));
  });
});
