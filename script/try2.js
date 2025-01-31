let type = document.title;
const file = `../data/${type}.json`; // lấy data
const file1 = `../data/${type}.json`; // lấy data
const file2 = `../data/n_${type}.json`; // lấy data

const appear_position = document.querySelector("#container"); // vị trí xuất hiện

let start = 0, end = 20;
let searchKeyword = ""; // Biến lưu từ khóa tìm kiếm

// Hiển thị trang hiện tại
const current_page = () => document.getElementById("page").value = end / 20;

// Tính tổng số trang
const max_page = length => Math.ceil(length / 20); // Làm tròn số trang

// Tải và hiển thị dữ liệu trang tiếp theo
const next_page = () => { start += 20; end += 20; object(); }

// Tải và hiển thị dữ liệu trang trước đó
const previous_page = () => { start -= 20; end -= 20; object(); }

// Nhảy đến trang chỉ định
const jump_to = move_to_page => { end = move_to_page * 20; start = end - 20; object(); }

// Thêm sự kiện khi người dùng nhập số trang và nhấn enter 
document.getElementById("page").addEventListener('keypress', e => {
    if (e.key === 'Enter') jump_to(Number(e.target.value));
});

// Hàm lấy dữ liệu từ file JSON 
const fetchJSON = async filex => {
    const response = await fetch(filex);
    return response.json();
}

// Hàm kết hợp hai file JSON 
const mergeJSONFiles = async (file1, file2) => {
    const [data1, data2] = await Promise.all([fetchJSON(file1), fetchJSON(file2)]);
    return [...data1, ...data2];
}

// Lọc dữ liệu dựa trên từ khóa tìm kiếm
const filterData = (data, keyword) => keyword ? data.filter(item => item.name.toLowerCase().includes(keyword.toLowerCase())) : data;

/*--- MAIN PROGRAM ---*/
const object = () => {
    appear_position.innerHTML = ""; // Xóa nội dung cũ
    current_page(); // Cập nhật trang hiện tại

    mergeJSONFiles(file2, file1).then(mergedData => {
        // Lọc dữ liệu dựa trên từ khóa tìm kiếm
        const filteredData = filterData(mergedData, searchKeyword);

        // Hiển thị dữ liệu từ start -> end
        filteredData.slice(start, end).forEach(obj => {
            const appear_obj = document.createElement("div");
            appear_obj.classList.add("asset");

            appear_obj.innerHTML = `
                <img src="${obj.img}" alt="">
                <div class="information">${obj.name}</div>
                <div class="source">
                    <a href="${obj.download}" target="_blank"><i class="fa-solid fa-download"></i></a>
                    <a href="${obj.source}" target="_blank"><i class="fa-solid fa-link"></i></a>
                </div>
            `;

            appear_position.appendChild(appear_obj);
        });

        document.getElementById("max").innerText = `/ ${max_page(filteredData.length)}`;
    });
}

// Thêm sự kiện tìm kiếm khi người dùng nhập từ khóa
document.getElementById("search").addEventListener("input", e => {
    searchKeyword = e.target.value; // Lấy từ khóa tìm kiếm
    start = 0; // Đặt lại trang bắt đầu
    end = 20; // Đặt lại số lượng hiển thị
    object(); // Cập nhật hiển thị
});

// Khởi chạy khi DOM được tải
document.addEventListener("DOMContentLoaded", object);
