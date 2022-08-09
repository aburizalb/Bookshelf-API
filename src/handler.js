const { nanoid } = require('nanoid');
const books = require('./books');

//tambah buku
const tambahBuku = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
  const newBuku = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (newBuku.name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  else if (newBuku.pageCount < newBuku.readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }
  books.push(newBuku);

  const jikaBerhasil = books.filter((buku) => buku.id === id).length > 0;

  if (jikaBerhasil) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

//tampilkan semua buku
const getAllBuku = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredbooks = books;

  if (name === '0') {
    filteredbooks = filteredbooks.filter((buku) => buku
      .name.toLowerCase().includes(name.toLowerCase()));
  }if (name === '1') {
    filteredbooks = filteredbooks.filter((buku) => buku
      .name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading === '0') {
    filteredbooks = filteredbooks.filter((buku) => buku.reading === !!Number(reading));
  } if (reading === '1') {
    filteredbooks = filteredbooks.filter((buku) => buku.reading === !!Number(reading));
  }

  if (finished === '0') {
    filteredbooks = filteredbooks.filter((buku) => buku.finished === !!Number(finished));
  }
  if (finished === '1') {
    filteredbooks = filteredbooks.filter((buku) => buku.finished === !!Number(finished));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredbooks.map((buku) => ({
        id: buku.id,
        name: buku.name,
        publisher: buku.publisher,
      })),
    },
  });
  response.code(200);

  return response;
};

//tampilkan buku sesuai id
const getBukuById = (request, h) => {
  const { id } = request.params;
  const buku = books.filter((b) => b.id === id)[0];

  if (buku !== undefined ) {
    return {
      status: 'success',
      data: {
        book: buku,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);

  return response;
};

//Mengubah Buku by ID
const editBuku = (request, h) => {
  const { id } = request.params;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((buku) => buku.id === id)[0];
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (index) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  };

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);

      return response;
    }

    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);

      return response;
    }

    const finished = (pageCount === readPage);
    
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
 
    response.code(200);
    return response;
  }
};

//hapus buku
const hapusBuku = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((buku) => buku.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  tambahBuku,
  getAllBuku,
  getBukuById,
  editBuku,
  hapusBuku,
};