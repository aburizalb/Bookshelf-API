const {
  tambahBuku,
  getAllBuku,
  getBukuById,
  editBuku,
  hapusBuku,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: tambahBuku,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBuku,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBukuById,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: editBuku,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: hapusBuku,
  },
];

module.exports = routes;