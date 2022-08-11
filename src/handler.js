const { nanoid } = require("nanoid");
const books = require("./books");

//tambah buku
const tambahBuku = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage;
	const newBook = {
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

	if (newBook.name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response.code(400);

		return response;
	} else if (newBook.pageCount < newBook.readPage) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);

		return response;
	}
	books.push(newBook);

	const jikaBerhasil = books.filter((book) => book.id === id).length > 0;

	if (jikaBerhasil) {
		const { id: bookId} = newBook;
		const response = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId,
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
			},
		});

		response.code(201);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal ditambahkan",
	});
	response.code(500);

	return response;
};

//tampilkan semua buku
const getAllBuku = (request, h) => {
	const { name, reading, finished } = request.query;

	let filteredbooks = books;

	if (name !== undefined) {
		filteredbooks = filteredbooks.filter((book) =>
			book.name.toLowerCase().includes(name.toLowerCase())
		);
	}
	if (reading !== undefined) {
		filteredbooks = filteredbooks.filter((book) => book.reading === !!Number(reading));
	}
	if (finished !== undefined) {
		filteredbooks = filteredbooks.filter((book) => book.finished === !!Number(finished));
	}

	const response = h.response({
		status: "success",
		data: {
			books: filteredbooks.map((book) => ({
				id: book.id,
				name: book.name,
				publisherbook: book.publisher,
			})),
		},
	});
	response.code(200);

	return response;
};

//tampilkan buku sesuai id
const getBukuById = (request, h) => {
	const { id } = request?.params;
	const book = books.find((b) => b.id === id);

	if (book !== undefined) {
		const response = h.response({
			status: "success",
			message: "Buku telah ditemukan",
			data: {
				book: book,
			},
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	});
	response.code(404);
	return response;
};

//Mengubah Buku by ID
const editBuku = (request, h) => {
	const { id } = request?.params;
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
	const updatedAt = new Date().toISOString();
	const index = books.findIndex((book) => book.id === id);

	if (index !== -1) {
		if (name === undefined) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. Mohon isi nama buku",
			});
			response.code(400);

			return response;
		}

		if (pageCount < readPage) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
			});
			response.code(400);

			return response;
		}

		const finished = pageCount === readPage;

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

		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});

		response.code(200);
		return response;
	}
	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});

	response.code(404);
	return response;
};

//hapus buku
const hapusBuku = (request, h) => {
	const { id } = request.params;

	const index = books.findIndex((book) => book.id === id);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);

		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
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
