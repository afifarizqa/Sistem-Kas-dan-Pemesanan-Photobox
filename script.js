// ========================================
// KONFIGURASI SUPABASE
// ========================================

const SUPABASE_URL = "https://xkzzhmqtxtwkhvnqqhhy.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_h9TqFv4-DAJE61vBTuLRew_I7_Rm9Ke";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

let pelangganSedangDiedit = null;
let pemesananSedangDiedit = null;
let transaksiSedangDiedit = null;


// ========================================
// SAAT HALAMAN DIBUKA
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    tampilkanPelanggan();
    tampilkanPemesanan();
    tampilkanTransaksiKas();
    updateDashboard();

    ["tabelPelanggan", "tabelPemesanan", "tabelKas"].forEach(function (idTabel) {
        document.getElementById(idTabel).addEventListener("click", function (event) {
            const tombol = event.target.closest("button[data-action]");
            if (!tombol) return;

            const aksiPerTabel = {
                tabelPelanggan: { edit: editPelanggan, delete: hapusPelanggan },
                tabelPemesanan: { edit: editPemesanan, delete: hapusPemesanan },
                tabelKas: { edit: editTransaksiKas, delete: hapusTransaksiKas }
            };
            aksiPerTabel[idTabel][tombol.dataset.action](tombol.dataset.id);
        });
    });

    document.getElementById("batalEditPelanggan").addEventListener("click", batalEditPelanggan);
    document.getElementById("batalEditPemesanan").addEventListener("click", batalEditPemesanan);
    document.getElementById("batalEditKas").addEventListener("click", batalEditTransaksiKas);
});

function tampilkanHalaman(namaHalaman) {
    document.querySelectorAll(".halaman").forEach(function (item) {
        item.classList.add("hidden");
    });

    document.getElementById(namaHalaman).classList.remove("hidden");

    if (namaHalaman === "pelanggan") tampilkanPelanggan();
    if (namaHalaman === "pemesanan") {
        tampilkanPelangganUntukPemesanan();
        tampilkanPemesanan();
    }
    if (namaHalaman === "kas") {
        tampilkanPemesananUntukKas();
        tampilkanTransaksiKas();
    }
}


// ========================================
// FORMAT RUPIAH
// ========================================

function formatRupiah(angka) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(angka);

}


// ========================================
// PELANGGAN
// ========================================

async function tampilkanPelanggan() {

    const { data, error } = await supabaseClient

        .from("pelanggan")

        .select("*")

        .order(
            "id_pelanggan",
            {
                ascending: true
            }
        );


    if (error) {

        console.error(error);

        alert("Gagal mengambil data pelanggan.");

        return;

    }


    const tabel =
        document.getElementById("tabelPelanggan");

    tabel.innerHTML = "";


    data.forEach(function (pelanggan) {

        tabel.innerHTML += `

            <tr>

                <td>
                    ${pelanggan.id_pelanggan}
                </td>

                <td>
                    ${escapeHtml(pelanggan.nama)}
                </td>

                <td>
                    ${escapeHtml(pelanggan.no_hp)}
                </td>

                <td>
                    <button type="button" data-action="edit" data-id="${pelanggan.id_pelanggan}">Ubah</button>
                    <button type="button" data-action="delete" data-id="${pelanggan.id_pelanggan}">Hapus</button>
                </td>

            </tr>

        `;

    });


    document.getElementById(
        "jumlahPelanggan"
    ).textContent = data.length;

}


// ========================================
// FORM TAMBAH PELANGGAN
// ========================================

document
    .getElementById("formPelanggan")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nama =
                document.getElementById(
                    "namaPelanggan"
                ).value;


            const noHp =
                document.getElementById(
                    "noHp"
                ).value;


            const query = pelangganSedangDiedit
                ? supabaseClient.from("pelanggan").update({ nama: nama, no_hp: noHp }).eq("id_pelanggan", pelangganSedangDiedit)
                : supabaseClient.from("pelanggan").insert([{ nama: nama, no_hp: noHp }]);

            const { error } = await query;


            if (error) {

                console.error(error);

                alert(
                    (pelangganSedangDiedit ? "Gagal memperbarui pelanggan: " : "Gagal menyimpan pelanggan: ") + error.message
                );

                return;

            }


            alert(
                pelangganSedangDiedit ? "Pelanggan berhasil diperbarui." : "Pelanggan berhasil ditambahkan."
            );


            document
                .getElementById(
                    "formPelanggan"
                )
                .reset();

            pelangganSedangDiedit = null;
            aturModeForm("formPelanggan", "batalEditPelanggan", false, "Simpan Pelanggan", "Perbarui Pelanggan");


            tampilkanPelanggan();

            updateDashboard();

        });

async function editPelanggan(id) {
    const { data, error } = await supabaseClient.from("pelanggan").select("*").eq("id_pelanggan", id).single();
    if (error) {
        console.error(error);
        alert("Gagal mengambil data pelanggan.");
        return;
    }

    pelangganSedangDiedit = data.id_pelanggan;
    document.getElementById("namaPelanggan").value = data.nama;
    document.getElementById("noHp").value = data.no_hp;
    aturModeForm("formPelanggan", "batalEditPelanggan", true, "Simpan Pelanggan", "Perbarui Pelanggan");
    document.getElementById("formPelanggan").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function hapusPelanggan(id) {
    if (!confirm("Hapus pelanggan ini? Data pelanggan yang sudah memiliki pemesanan tidak dapat dihapus.")) return;

    const { error } = await supabaseClient.from("pelanggan").delete().eq("id_pelanggan", id);
    if (error) {
        console.error(error);
        alert("Gagal menghapus pelanggan. Pastikan pelanggan belum memiliki pemesanan.");
        return;
    }

    await tampilkanPelanggan();
    updateDashboard();
}

function batalEditPelanggan() {
    pelangganSedangDiedit = null;
    document.getElementById("formPelanggan").reset();
    aturModeForm("formPelanggan", "batalEditPelanggan", false, "Simpan Pelanggan", "Perbarui Pelanggan");
}


// ========================================
// DROPDOWN PELANGGAN
// ========================================

async function tampilkanPelangganUntukPemesanan() {

    const { data, error } =
        await supabaseClient

            .from("pelanggan")

            .select("*")

            .order("nama");


    if (error) {

        console.error(error);

        return;

    }


    const select =
        document.getElementById(
            "pelangganPemesanan"
        );


    select.innerHTML = `
        <option value="">
            -- Pilih Pelanggan --
        </option>
    `;


    data.forEach(function (pelanggan) {

        select.innerHTML += `

            <option value="${pelanggan.id_pelanggan}">

                ${escapeHtml(pelanggan.nama)}

            </option>

        `;

    });

}


// ========================================
// PEMESANAN
// ========================================

async function tampilkanPemesanan() {

    const { data, error } =
        await supabaseClient

            .from("pemesanan")

            .select(`
                *,
                pelanggan (
                    nama
                )
            `)

            .order(
                "id_pemesanan",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil data pemesanan."
        );

        return;

    }


    const tabel =
        document.getElementById(
            "tabelPemesanan"
        );


    tabel.innerHTML = "";


    data.forEach(function (pesanan) {

        tabel.innerHTML += `

            <tr>

                <td>
                    ${pesanan.id_pemesanan}
                </td>

                <td>
                    ${escapeHtml(pesanan.pelanggan.nama)}
                </td>

                <td>
                    ${pesanan.tanggal_sesi}
                </td>

                <td>
                    ${pesanan.jam_sesi}
                </td>

                <td>
                    ${escapeHtml(pesanan.jenis_paket)}
                </td>

                <td>
                    ${formatRupiah(
                        pesanan.total_harga
                    )}
                </td>

                <td>
                    ${escapeHtml(pesanan.status)}
                </td>

                <td>
                    <button type="button" data-action="edit" data-id="${pesanan.id_pemesanan}">Ubah</button>
                    <button type="button" data-action="delete" data-id="${pesanan.id_pemesanan}">Hapus</button>
                </td>

            </tr>

        `;

    });


    document.getElementById(
        "jumlahPemesanan"
    ).textContent = data.length;

}


// ========================================
// FORM PEMESANAN
// ========================================

document
    .getElementById("formPemesanan")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const idPelanggan =
                document.getElementById(
                    "pelangganPemesanan"
                ).value;


            const tanggalSesi =
                document.getElementById(
                    "tanggalSesi"
                ).value;


            const jamSesi =
                document.getElementById(
                    "jamSesi"
                ).value;


            const jenisPaket =
                document.getElementById(
                    "jenisPaket"
                ).value;


            const totalHarga =
                document.getElementById(
                    "totalHarga"
                ).value;


            const status =
                document.getElementById(
                    "statusPemesanan"
                ).value;


            const nilaiPemesanan = {
                id_pelanggan: idPelanggan,
                tanggal_sesi: tanggalSesi,
                jam_sesi: jamSesi,
                jenis_paket: jenisPaket,
                total_harga: totalHarga,
                status: status
            };
            const query = pemesananSedangDiedit
                ? supabaseClient.from("pemesanan").update(nilaiPemesanan).eq("id_pemesanan", pemesananSedangDiedit)
                : supabaseClient.from("pemesanan").insert([nilaiPemesanan]);
            const { error } = await query;


            if (error) {

                console.error(error);

                alert(
                    pemesananSedangDiedit ? "Gagal memperbarui pemesanan." : "Gagal menyimpan pemesanan."
                );

                return;

            }


            alert(
                pemesananSedangDiedit ? "Pemesanan berhasil diperbarui." : "Pemesanan berhasil disimpan."
            );


            document
                .getElementById(
                    "formPemesanan"
                )
                .reset();

            pemesananSedangDiedit = null;
            aturModeForm("formPemesanan", "batalEditPemesanan", false, "Simpan Pemesanan", "Perbarui Pemesanan");


            tampilkanPemesanan();

            updateDashboard();

        });

async function editPemesanan(id) {
    await tampilkanPelangganUntukPemesanan();
    const { data, error } = await supabaseClient.from("pemesanan").select("*").eq("id_pemesanan", id).single();
    if (error) {
        console.error(error);
        alert("Gagal mengambil data pemesanan.");
        return;
    }

    pemesananSedangDiedit = data.id_pemesanan;
    document.getElementById("pelangganPemesanan").value = data.id_pelanggan;
    document.getElementById("tanggalSesi").value = data.tanggal_sesi;
    document.getElementById("jamSesi").value = data.jam_sesi;
    document.getElementById("jenisPaket").value = data.jenis_paket;
    document.getElementById("totalHarga").value = data.total_harga;
    document.getElementById("statusPemesanan").value = data.status;
    aturModeForm("formPemesanan", "batalEditPemesanan", true, "Simpan Pemesanan", "Perbarui Pemesanan");
    document.getElementById("formPemesanan").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function hapusPemesanan(id) {
    if (!confirm("Hapus pemesanan ini? Pemesanan yang sudah memiliki transaksi kas tidak dapat dihapus.")) return;

    const { error } = await supabaseClient.from("pemesanan").delete().eq("id_pemesanan", id);
    if (error) {
        console.error(error);
        alert("Gagal menghapus pemesanan. Hapus transaksi kas terkait terlebih dahulu.");
        return;
    }

    await tampilkanPemesanan();
    await tampilkanPemesananUntukKas();
    updateDashboard();
}

function batalEditPemesanan() {
    pemesananSedangDiedit = null;
    document.getElementById("formPemesanan").reset();
    aturModeForm("formPemesanan", "batalEditPemesanan", false, "Simpan Pemesanan", "Perbarui Pemesanan");
}


// ========================================
// DROPDOWN PEMESANAN UNTUK KAS
// ========================================

async function tampilkanPemesananUntukKas() {

    const { data, error } =
        await supabaseClient

            .from("pemesanan")

            .select(`
                id_pemesanan,
                tanggal_sesi,
                pelanggan (
                    nama
                )
            `)

            .order(
                "id_pemesanan",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        return;

    }


    const select =
        document.getElementById(
            "pemesananKas"
        );


    select.innerHTML = `
        <option value="">
            -- Pilih Pemesanan --
        </option>
    `;


    data.forEach(function (pesanan) {

        select.innerHTML += `

            <option value="${pesanan.id_pemesanan}">

                #${pesanan.id_pemesanan}
                -
                ${escapeHtml(pesanan.pelanggan.nama)}

            </option>

        `;

    });

}


// ========================================
// TRANSAKSI KAS
// ========================================

async function tampilkanTransaksiKas() {

    const { data, error } =
        await supabaseClient

            .from("transaksi_kas")

            .select(`
                *,
                pemesanan (
                    id_pemesanan,
                    pelanggan (
                        nama
                    )
                )
            `)

            .order(
                "id_transaksi",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(error);

        alert(
            "Gagal mengambil transaksi kas."
        );

        return;

    }


    const tabel =
        document.getElementById(
            "tabelKas"
        );


    tabel.innerHTML = "";


    data.forEach(function (transaksi) {

        tabel.innerHTML += `

            <tr>

                <td>
                    ${transaksi.id_transaksi}
                </td>

                <td>
                    #${transaksi.id_pemesanan}
                    -
                    ${escapeHtml(transaksi.pemesanan.pelanggan.nama)}
                </td>

                <td>
                    ${transaksi.tanggal}
                </td>

                <td>
                    ${escapeHtml(transaksi.jenis)}
                </td>

                <td>
                    ${formatRupiah(
                        transaksi.jumlah
                    )}
                </td>

                <td>
                    ${escapeHtml(transaksi.keterangan || "-")}
                </td>

                <td>
                    <button type="button" data-action="edit" data-id="${transaksi.id_transaksi}">Ubah</button>
                    <button type="button" data-action="delete" data-id="${transaksi.id_transaksi}">Hapus</button>
                </td>

            </tr>

        `;

    });

}


// ========================================
// FORM TRANSAKSI KAS
// ========================================

document
    .getElementById("formKas")
    .addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const idPemesanan =
                document.getElementById(
                    "pemesananKas"
                ).value;


            const jenis =
                document.getElementById(
                    "jenisKas"
                ).value;


            const jumlah =
                document.getElementById(
                    "jumlahKas"
                ).value;


            const keterangan =
                document.getElementById(
                    "keteranganKas"
                ).value;


            const nilaiTransaksi = {
                id_pemesanan: idPemesanan,
                jenis: jenis,
                jumlah: jumlah,
                keterangan: keterangan
            };
            const query = transaksiSedangDiedit
                ? supabaseClient.from("transaksi_kas").update(nilaiTransaksi).eq("id_transaksi", transaksiSedangDiedit)
                : supabaseClient.from("transaksi_kas").insert([nilaiTransaksi]);
            const { error } = await query;


            if (error) {

                console.error(error);

                alert(
                    transaksiSedangDiedit ? "Gagal memperbarui transaksi." : "Gagal menyimpan transaksi."
                );

                return;

            }


            alert(
                transaksiSedangDiedit ? "Transaksi berhasil diperbarui." : "Transaksi berhasil disimpan."
            );


            document
                .getElementById(
                    "formKas"
                )
                .reset();

            transaksiSedangDiedit = null;
            aturModeForm("formKas", "batalEditKas", false, "Simpan Transaksi", "Perbarui Transaksi");


            tampilkanTransaksiKas();

            updateDashboard();

        });

async function editTransaksiKas(id) {
    await tampilkanPemesananUntukKas();
    const { data, error } = await supabaseClient.from("transaksi_kas").select("*").eq("id_transaksi", id).single();
    if (error) {
        console.error(error);
        alert("Gagal mengambil data transaksi.");
        return;
    }

    transaksiSedangDiedit = data.id_transaksi;
    document.getElementById("pemesananKas").value = data.id_pemesanan;
    document.getElementById("jenisKas").value = data.jenis;
    document.getElementById("jumlahKas").value = data.jumlah;
    document.getElementById("keteranganKas").value = data.keterangan || "";
    aturModeForm("formKas", "batalEditKas", true, "Simpan Transaksi", "Perbarui Transaksi");
    document.getElementById("formKas").scrollIntoView({ behavior: "smooth", block: "start" });
}

async function hapusTransaksiKas(id) {
    if (!confirm("Hapus transaksi kas ini?")) return;

    const { error } = await supabaseClient.from("transaksi_kas").delete().eq("id_transaksi", id);
    if (error) {
        console.error(error);
        alert("Gagal menghapus transaksi kas.");
        return;
    }

    await tampilkanTransaksiKas();
    updateDashboard();
}

function batalEditTransaksiKas() {
    transaksiSedangDiedit = null;
    document.getElementById("formKas").reset();
    aturModeForm("formKas", "batalEditKas", false, "Simpan Transaksi", "Perbarui Transaksi");
}


// ========================================
// DASHBOARD
// ========================================

async function updateDashboard() {

    // Total pelanggan

    const { count: jumlahPelanggan } =
        await supabaseClient

            .from("pelanggan")

            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );


    document.getElementById(
        "jumlahPelanggan"
    ).textContent =
        jumlahPelanggan || 0;


    // Total pemesanan

    const { count: jumlahPemesanan } =
        await supabaseClient

            .from("pemesanan")

            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );


    document.getElementById(
        "jumlahPemesanan"
    ).textContent =
        jumlahPemesanan || 0;


    // Ambil transaksi kas

    const { data, error } =
        await supabaseClient

            .from("transaksi_kas")

            .select(
                "jenis, jumlah"
            );


    if (error) {

        console.error(error);

        return;

    }


    let pemasukan = 0;

    let pengeluaran = 0;


    data.forEach(function (transaksi) {

        const jumlah =
            Number(transaksi.jumlah);


        if (
            transaksi.jenis ===
            "Pemasukan"
        ) {

            pemasukan += jumlah;

        }


        if (
            transaksi.jenis ===
            "Pengeluaran"
        ) {

            pengeluaran += jumlah;

        }

    });


    document.getElementById(
        "totalPemasukan"
    ).textContent =
        formatRupiah(pemasukan);


    document.getElementById(
        "totalPengeluaran"
    ).textContent =
        formatRupiah(pengeluaran);

}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (karakter) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[karakter];
    });
}

function aturModeForm(formId, tombolBatalId, sedangEdit, teksTambah, teksEdit) {
    const form = document.getElementById(formId);
    form.querySelector('button[type="submit"]').textContent = sedangEdit ? teksEdit : teksTambah;
    document.getElementById(tombolBatalId).classList.toggle("hidden", !sedangEdit);
}