/* Memuat kode untuk membuat, mengkonfigurasi, dan menjalankan server HTTP menggunakan Hapi */
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 5000,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
          },
    });


    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();