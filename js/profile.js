document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user info
    document.getElementById('profile-name').textContent = currentUser.fullName;
    document.getElementById('profile-email').textContent = currentUser.email;
    
    // Set profile picture (use saved one or default)
    const profilePicture = document.getElementById('profile-picture');
    if (profilePicture) {
        profilePicture.src = currentUser.profilePicture || 'assets/stock_pfp.png';
    }
    
    // Display adopted pets
    displayAdoptedPets();
    
    // Edit profile functionality
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.querySelector('.profile-edit-form');
    const profileInfo = document.querySelector('.profile-info');
    
    editProfileBtn?.addEventListener('click', function() {
        profileInfo.style.display = 'none';
        editForm.style.display = 'block';
        document.getElementById('edit-fullname').value = currentUser.fullName;
        document.getElementById('edit-email').value = currentUser.email;
    });
    
    cancelEditBtn?.addEventListener('click', function() {
        profileInfo.style.display = 'flex';
        editForm.style.display = 'none';
    });
    
    // Handle form submission
    const editFormElement = document.getElementById('edit-profile-form');
    if (editFormElement) {
        editFormElement.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('edit-fullname').value;
            const email = document.getElementById('edit-email').value;
            const password = document.getElementById('edit-password').value;
            const confirmPassword = document.getElementById('edit-confirm-password').value;
            
            if (password && password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            const updatedInfo = { fullName, email };
            if (password) updatedInfo.password = password;
            
            if (updateProfile(updatedInfo)) {
                alert('Profile updated successfully!');
                document.getElementById('profile-name').textContent = fullName;
                document.getElementById('profile-email').textContent = email;
                profileInfo.style.display = 'flex';
                editForm.style.display = 'none';
            } else {
                alert('Failed to update profile');
            }
        });
    }
    
    // Avatar upload functionality
    const avatarUpload = document.getElementById('avatar-upload');
    if (avatarUpload) {
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file size (optional - limit to 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                
                // Check file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageData = event.target.result;
                    
                    // Update the profile picture display
                    document.getElementById('profile-picture').src = imageData;
                    
                    // Save to localStorage
                    if (updateProfilePicture(imageData)) {
                        console.log('Profile picture updated successfully');
                    } else {
                        console.error('Failed to save profile picture');
                        alert('Failed to save profile picture');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Make profile picture clickable to trigger file upload
        document.getElementById('profile-picture').addEventListener('click', function() {
            avatarUpload.click();
        });
    }
});

function displayAdoptedPets() {
    const currentUser = getCurrentUser();
    const adoptedPetsGrid = document.getElementById('adopted-pets-grid');
    const noPetsMessage = document.getElementById('no-pets-message');
    
    if (!currentUser?.adoptedPets || currentUser.adoptedPets.length === 0) {
        if (noPetsMessage) noPetsMessage.style.display = 'block';
        if (adoptedPetsGrid) adoptedPetsGrid.innerHTML = '';
        return;
    }
    
    if (noPetsMessage) noPetsMessage.style.display = 'none';
    if (!adoptedPetsGrid) return;
    
    adoptedPetsGrid.innerHTML = '';
    
    currentUser.adoptedPets.forEach(petId => {
        const pet = getPetById(petId);
        if (!pet) return;
        
        const petCard = document.createElement('div');
        petCard.className = 'pet-card';
        petCard.innerHTML = `
            <div class="pet-image-container">
                <img src="${pet.images[0] || 'assets/default-pet.jpg'}" alt="${pet.name}" class="pet-image">
            </div>
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p>${pet.breed}</p>
                <p>Adopted on ${new Date().toLocaleDateString()}</p>
                <a href="pet-details.html?id=${petId}" class="btn btn-secondary">View Details</a>
            </div>
        `;
        adoptedPetsGrid.appendChild(petCard);
    });
}

function getPetById(petId) {
    // Mock pet data - in a real app, this would come from a database
    const pets = {
        '1': {
            id: '1',
            name: 'Toffy',
            breed: 'Golden Retriever',
            age: '3 years old',
            location: 'Metro Manila',
            gender: 'Male',
            description: 'Toffy is a gentle giant who loves cuddles and playing fetch.',
            images: ['assets/Toffy.jpg', 'assets/Toffy2.jpg']
        },
        '2': {
            id: '2',
            name: 'Lili',
            breed: 'Siberian Cat',
            age: '4 months old',
            location: 'Quezon City',
            gender: 'Female',
            description: 'Lili is a playful kitten who loves chasing toys.',
            images: ['assets/Lili.jpg']
        },
        '3': {
            id: '3',
            name: 'Coco',
            breed: 'Parrot',
            age: '1 year old',
            location: 'Makati City',
            gender: 'Male',
            description: 'Coco is a smart and talkative parrot.',
            images: ['assets/Coco.jpg']
        }
    };
    return pets[petId];
}