// Account management system
function createAccount(fullName, email, password) {
    if (!fullName || !email || !password) return false;
    
    const user = {
        fullName: fullName,
        email: email,
        password: password, // Note: In production, hash passwords!
        adoptedPets: []
    };
    
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('Email already registered!');
        return false;
    }
    
    // Add new user
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
}

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function updateProfile(updatedInfo) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = getCurrentUser();
    
    if (!currentUser) return false;
    
    users = users.map(user => {
        if (user.email === currentUser.email) {
            return {...user, ...updatedInfo};
        }
        return user;
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({...currentUser, ...updatedInfo}));
    return true;
}

function adoptPet(petId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to adopt a pet');
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    
    if (!currentUser.adoptedPets.includes(petId)) {
        currentUser.adoptedPets.push(petId);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in all users
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.map(user => {
            if (user.email === currentUser.email) {
                return currentUser;
            }
            return user;
        });
        localStorage.setItem('users', JSON.stringify(users));
    }
    return true;
}

// Handle adoption button clicks
function handleAdoptionClick(petId, buttonElement) {
    if (adoptPet(petId)) {
        alert('Adoption request submitted! Our team will contact you soon.');
        if (buttonElement) {
            buttonElement.textContent = 'Adoption Pending';
            buttonElement.disabled = true;
        }
        return true;
    }
    return false;
}

// Initialize adoption buttons
function initAdoptionButtons() {
    document.querySelectorAll('.adopt-btn').forEach(button => {
        button.addEventListener('click', function() {
            const petId = this.getAttribute('data-pet-id');
            handleAdoptionClick(petId, this);
        });
    });
}

// Initialize navbar and other elements on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarAuth();
    initAdoptionButtons();
    
    // Add logout event listener if logout button exists
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

function updateNavbarAuth() {
    const authContainer = document.querySelector('.navbar-auth');
    if (!authContainer) return;
    
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        authContainer.innerHTML = `
            <a href="profile.html" class="auth-btn profile-btn">MY PROFILE</a>
            <a href="#" id="logout-btn" class="auth-btn logout-btn">LOGOUT</a>
        `;
        document.getElementById('logout-btn').addEventListener('click', logout);
    } else {
        authContainer.innerHTML = `
            <a href="signup.html" class="auth-btn signup-btn">SIGN UP</a>
            <a href="login.html" class="auth-btn login-btn">LOGIN</a>
        `;
    }
}