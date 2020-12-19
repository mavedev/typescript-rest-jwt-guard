import App from './App';

/**
 * Start the server.
 */
async function startServer(): Promise<void> {
  const apiServer = new App();
  await apiServer.start();
  const graceful = async () => {
    await apiServer.stop();
    process.exit(0);
  };

  process.on('SIGTERM', graceful);
  process.on('SIGINT', graceful);
}

export = startServer;
