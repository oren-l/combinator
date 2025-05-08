import net from "node:net";

export async function getRandomPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);

    server.listen(0, () => {
      const address = server.address();
      server.close(() => {
        if (address instanceof Object) {
          return resolve(address.port);
        }
        reject(`typeof server.address is ${typeof address} not net.AddressInfo: ${address}`);
      });
    });
  });
}
