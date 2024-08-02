document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const locationInput = document.getElementById('locationInput');
  const barsList = document.getElementById('barsList');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  if (searchBtn) {
    searchBtn.addEventListener('click', async () => {
  const location = locationInput.value;
  if (location) {
    const token = localStorage.getItem('token'); 
    try {
      const response = await fetch(`http://localhost:5000/api/bars?location=${location}`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const bars = await response.json();
      displayBars(bars);
    } catch (error) {
      console.error('Error fetching bars', error);
    }
  } else {
    alert('Please enter a location');
  }
});
  }

  const displayBars = (bars) => {
    barsList.innerHTML = '';
    bars.forEach(bar => {
      const barItem = document.createElement('div');
      barItem.innerHTML = `
        <h2>${bar.name}</h2>
        <button data-id="${bar._id}" class="attendBtn">I'm going!</button>
      `;
      barsList.appendChild(barItem);
    });

    document.querySelectorAll('.attendBtn').forEach(button => {
      button.addEventListener('click', async () => {
        const barId = button.getAttribute('data-id');
        await attendBar(barId, button);
      });
    });
  };

  const attendBar = async (barId, button) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You need to log in first');

    try {
      const response = await fetch(`http://localhost:5000/api/bars/${barId}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        button.textContent = 'Remove';
        button.classList.remove('attendBtn');
        button.classList.add('removeBtn');
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error attending bar:', error);
    }
  };

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('token', data.token);
          alert('Login successful');
          window.location.href = 'profile.html';
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;

      try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          alert('Registration successful');
          window.location.href = 'login.html';
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    });
  }
});
