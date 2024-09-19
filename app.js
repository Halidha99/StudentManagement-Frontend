function hideUpdateForm() {
    document.getElementById('updateForm').style.display = 'none'; 
}

loadTable();
function loadTable() {
    let stdTable = document.getElementById("tblstudents");

    // Table header
    let body = `<tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Batch Name</th>
                    <th>Register Date</th>
                    <th>Image</th>
                    <th>Actions</th>
                </tr>`;

    fetch("http://localhost:8080/student")
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                body += `<tr><td colspan="11">No students found.</td></tr>`;
            } else {
                data.forEach(student => {
                    body += `<tr>
                                <td>${student.id}</td>
                                <td>${student.fullName}</td>
                                <td>${student.dob}</td>
                                <td>${student.gender}</td>
                                <td>${student.email}</td>
                                <td>${student.phoneNumber}</td>
                                <td>${student.address}</td>
                                <td>${student.batchName}</td>
                                <td>${student.registerDate}</td>
                                <td>
                                    ${student.imageName ? `<img src="data:image/jpeg;base64,${student.imageName}" alt="Student Image" width="100px"/>` : 'No Image'}
                                </td>
                                <td>
                                    <button class="btn btn-warning btn-sm" onclick="updateStudent(${student.id})">Update</button>
                                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
                                   <button class="btn btn-success" onclick="printStudentById(${student.id})">Print</button>
                                </td>
                            </tr>`;
                });
            }
            stdTable.innerHTML = body;
        })
        .catch(error => console.error('Error:', error));
}


function addStudent() {
    const fullName = document.getElementById('studentName').value.trim();
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const batchName = document.getElementById('batchName/Id').value.trim();
    const registerDate = document.getElementById('registerdate').value;
    const image = document.getElementById('image').files[0]; 

    const formData = new FormData();
    formData.append("student", new Blob([JSON.stringify({
        fullName: fullName,
        dob: dob,
        gender: gender,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        batchName: batchName,
        registerDate: registerDate
    })], { type: "application/json" }));

    if (image) {
        formData.append("image", image);
    }

    fetch("http://localhost:8080/student/addstudent", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
    })
    .then(result => {
        console.log(result);
        loadTable(); 
        clearForm(); 
    })
    .catch(error => console.error('Error:', error));
}


function clearForm() {
    document.getElementById('studentName').value = '';
    document.getElementById('dob').value = '';
    document.getElementById('gender').value = 'male';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
    document.getElementById('batchName/Id').value = '';
    document.getElementById('registerdate').value = '';
    document.getElementById('image').value = ''; 
}


function searchStudent() {
    const searchInput = document.getElementById('searchInput').value;
  
    fetch(`http://localhost:8080/student/find-By-Name/${encodeURIComponent(searchInput)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        redirect: "follow"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(result => {
        console.log("Search results:", result);
        printStudent(result); 
    })
    .catch(error => console.error('Error:', error));
  }
  function printStudent(students) {
    const tableBody = document.querySelector('#tblstudents tbody');
    tableBody.innerHTML = ''; 
  
    students.forEach(student => {
        const row = document.createElement('tr');
        
        
        const idCell = document.createElement('td');
        idCell.textContent = student.id;
        row.appendChild(idCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = student.fullName;
        row.appendChild(nameCell);
        
        const dobCell = document.createElement('td');
        dobCell.textContent = student.dob;
        row.appendChild(dobCell);
        
        const genderCell = document.createElement('td');
        genderCell.textContent = student.gender;
        row.appendChild(genderCell);
        
        const emailCell = document.createElement('td');
        emailCell.textContent = student.email;
        row.appendChild(emailCell);
        
        const phoneCell = document.createElement('td');
        phoneCell.textContent = student.phoneNumber;
        row.appendChild(phoneCell);
        
        const addressCell = document.createElement('td');
        addressCell.textContent = student.address;
        row.appendChild(addressCell);
        
        const batchCell = document.createElement('td');
        batchCell.textContent = student.batchName;
        row.appendChild(batchCell);
        
        const registerDateCell = document.createElement('td');
        registerDateCell.textContent = student.registerDate;
        row.appendChild(registerDateCell);
        
        
        if (student.image) {
            const imageCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = student.image; 
            img.alt = 'Student Image';
            img.style.width = '100px'; 
            imageCell.appendChild(img);
            row.appendChild(imageCell);
        }
  
        tableBody.appendChild(row);
    });
  }
  



function printStudentById(studentId) {
    fetch(`http://localhost:8080/student/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(student => {
            
            displayStudentDetails(student);
        })
        .catch(error => console.error('Error:', error));
}

function displayStudentDetails(student) {
    const tableBody = document.querySelector('#tblstudents tbody');
    tableBody.innerHTML = ''; 

  
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.fullName}</td>
        <td>${student.dob}</td>
        <td>${student.gender}</td>
        <td>${student.email}</td>
        <td>${student.phoneNumber}</td>
        <td>${student.address}</td>
        <td>${student.batchName}</td>
        <td>${student.registerDate}</td>
        <td>${student.imageName ? `<img src="data:image/jpeg;base64,${student.imageName}" alt="Student Image" width="100px"/>` : 'No Image'}</td>
    `;
    tableBody.appendChild(row);
}


// delete//
function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        fetch(`http://localhost:8080/student/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(result => {
            console.log(result);
            loadTable(); 
        })
        .catch(error => console.error('Error:', error));
    }
}

/////////////////////////update////////////////////////
function updateStudent(studentId) {
    fetch(`http://localhost:8080/student/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(student => {
            document.getElementById('updateId').value = student.id;
            document.getElementById('updateFullName').value = student.fullName;
            document.getElementById('updateDob').value = student.dob;
            document.getElementById('updateGender').value = student.gender;
            document.getElementById('updateEmail').value = student.email;
            document.getElementById('updatePhone').value = student.phoneNumber;
            document.getElementById('updateAddress').value = student.address;
            document.getElementById('updateBatchName').value = student.batchName;
            document.getElementById('updateRegisterDate').value = student.registerDate;
            document.getElementById('updateImage').src = student.imageName ? `data:image/jpeg;base64,${student.imageName}` : 'default.jpg';
            
            document.getElementById('updateForm').style.display = 'block'; 
        })
        .catch(error => console.error('Error:', error));
}
function submitUpdatedStudent() {
    const studentId = document.getElementById('updateId').value;
    const fullName = document.getElementById('updateFullName').value;
    const dob = document.getElementById('updateDob').value;
    const gender = document.getElementById('updateGender').value;
    const email = document.getElementById('updateEmail').value;
    const phoneNumber = document.getElementById('updatePhone').value;
    const address = document.getElementById('updateAddress').value;
    const batchName = document.getElementById('updateBatchName').value;
    const registerDate = document.getElementById('updateRegisterDate').value;
    const image = document.getElementById('updateImageInput').files[0]; 

    const formData = new FormData();
    
    formData.append('student', new Blob([JSON.stringify({
        id: studentId,
        fullName: fullName,
        dob: dob,
        gender: gender,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
        batchName: batchName,
        registerDate: registerDate
    })], { type: 'application/json' }));

    if (image) {
        formData.append('image', image);
    }

    fetch(`http://localhost:8080/student/update/${studentId}`, {
        method: 'PATCH',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(result => {
        console.log(result);
        loadTable(); 
        hideUpdateForm(); 
    })
    .catch(error => console.error('Error:', error));
}
