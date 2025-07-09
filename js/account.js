function createAccount(fullName, email, password) {
    if (!fullName || !email || !password) return false;
    
    const user = {
        fullName: fullName,
        email: email,
        password: password, // Note: In production, hash passwords!
        adoptedPets: [],
        profilePicture: 'assets/stock_pfp.png' // Set default profile picture
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
        // Ensure user has profilePicture property (for existing users)
        if (!user.profilePicture) {
            user.profilePicture = 'assets/stock_pfp.png';
        }
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
    const user = JSON.parse(localStorage.getItem('currentUser'));
    // Ensure user has profilePicture property (for existing users)
    if (user && !user.profilePicture) {
        user.profilePicture = 'assets/stock_pfp.png';
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    return user;
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

function updateProfilePicture(profilePictureData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    return updateProfile({ profilePicture: profilePictureData });
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

// Handle login form submission
function handleLoginForm() {
    const loginForm = document.querySelector('.auth-form-content');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (login(email, password)) {
            alert('Login successful!');
            
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            if (redirect) {
                window.location.href = decodeURIComponent(redirect);
            } else {
                window.location.href = 'index.html';
            }
        } else {
            alert('Invalid email or password');
        }
    });
}

// Handle signup form submission
function handleSignupForm() {
    const signupForm = document.querySelector('.auth-form-content');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsAccepted = document.getElementById('terms').checked;
        
        if (!fullName || !email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        if (!termsAccepted) {
            alert('Please accept the terms of service');
            return;
        }
        
        if (createAccount(fullName, email, password)) {
            alert('Account created successfully!');
            window.location.href = 'index.html';
        }
    });
}

// Initialize navbar and other elements on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarAuth();
    initAdoptionButtons();
    
    // Initialize form handlers based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'signup.html') {
        handleSignupForm();
    } else if (currentPage === 'login.html') {
        handleLoginForm();
    }
    
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