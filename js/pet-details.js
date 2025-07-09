document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    
    if (!petId) {
        window.location.href = 'adopt.html';
        return;
    }
    
    const pet = getPetById(petId);
    if (!pet) {
        window.location.href = 'adopt.html';
        return;
    }
    
    // Display pet details
    document.getElementById('pet-name').textContent = pet.name;
    document.getElementById('main-pet-image').src = pet.images[0];
    document.getElementById('pet-breed').textContent = pet.breed;
    document.getElementById('pet-age').textContent = pet.age;
    document.getElementById('pet-location').textContent = pet.location;
    document.getElementById('pet-gender').textContent = pet.gender;
    document.getElementById('pet-description-text').textContent = pet.description;
    
    // Add thumbnails
    const thumbnailContainer = document.getElementById('thumbnail-container');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = '';
        pet.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `${pet.name} thumbnail ${index + 1}`;
            thumbnail.className = 'thumbnail';
            thumbnail.addEventListener('click', function() {
                document.getElementById('main-pet-image').src = image;
            });
            thumbnailContainer.appendChild(thumbnail);
        });
    }
    
    // Handle adopt button
    const adoptBtn = document.getElementById('adopt-btn');
    if (adoptBtn) {
        adoptBtn.addEventListener('click', function() {
            const currentUser = getCurrentUser();
            
            if (!currentUser) {
                if (confirm('You need to login to adopt a pet. Would you like to login now?')) {
                    window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
                }
                return;
            }
            
            if (adoptPet(petId)) {
                alert(`Congratulations! You've adopted ${pet.name}.`);
                this.textContent = 'Adopted!';
                this.disabled = true;
            }
        });
    }
    
    // Check if already adopted - FIXED: Added missing closing parenthesis
    const currentUser = getCurrentUser();
    if (currentUser?.adoptedPets?.includes(petId)) {
        if (adoptBtn) {
            adoptBtn.textContent = 'Already Adopted';
            adoptBtn.disabled = true;
        }
    }
});

// Shared with profile.js
function getPetById(petId) {
    // Same function as in profile.js
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