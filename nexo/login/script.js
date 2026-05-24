/*=======================================Valida Login=====================================*/
const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); //Impede o recarregamento da página

    //Captura os valores dos campos
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        //Faz a requisição para o backend
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await response.json();

        if (response.ok) {
            // Sucesso: Armazena o Token JWT e os dados do usuário no localStorage
            localStorage.setItem('token', dados.token);
            localStorage.setItem('usuario', JSON.stringify(dados.usuario));

            alert('Login realizado com sucesso!');
        
            //Redireciona para tela Inicial
            window.location.href ='../telaInicial/index.html';  
        
        } else {
            //Erro retornado pelo controller (ex: "Email ou senha inválidos")
            alert(dados.erro || 'Erro ao realizar login');
        }

    } catch (error) {
        console.error('Erro na conexão:', error);
        alert('Não foi possível conectar ao servidor.');
    }
});
/*===========================================================================================*/
