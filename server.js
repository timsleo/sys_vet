import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient()

const app = express()

app.use(express.json())
app.use(cors())


//Clients
app.post('/clients', async (req, res) => {

    await prisma.client.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            telefone: req.body.telefone,
            cpf: req.body.cpf,
            rua: req.body.rua,
            complemento: req.body.complemento,
            cidade: req.body.cidade
        }
    })
    res.status(201).json(req.body)
})

app.get('/clients', async (req, res) => {
    const { name } = req.query;

    const Clients = await prisma.client.findMany({
        where: name
            ? {
                  name: {
                      contains: name, // Busca parcial
                      mode: 'insensitive', // Ignora maiúsculas/minúsculas
                  },
              }
            : undefined,
        include: {
            pets: true, // Inclui os pets associados
        },
    });

    res.status(200).json(Clients);
});


app.put('/clients/:id', async (req, res) => {
    try {
        const updatedClient = await prisma.client.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                telefone: req.body.telefone,
                cpf: req.body.cpf,
                rua: req.body.rua,
                complemento: req.body.complemento,
                cidade: req.body.cidade
            }
        });

        // Retorne o cliente atualizado no corpo da resposta
        res.status(200).json(updatedClient);  // Retorna o cliente atualizado
    } catch (error) {
        res.status(404).json({ message: 'Cliente não encontrado' });  // Caso o cliente não exista
    }
});

app.delete('/clients/:id', async (req, res) => {
    await prisma.client.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({ message: 'Cliente deletado com sucesso!' })
})

//Pets
app.post('/clients/:id/pets', async (req, res) => {
    try {
        const clientId = req.params.id;
        const { name, species, breed, age } = req.body;

        // Verifique se o cliente existe
        const client = await prisma.client.findUnique({
            where: { id: clientId }, // Certifique-se de que o campo `id` existe no schema do Prisma
            include: { pets: true },
        });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Crie o pet e relacione com o cliente
        const newPet = await prisma.pet.create({
            data: {
                name,
                species,
                breed,
                age,
                owner: {
                    connect: { id: clientId }, // Relaciona o pet ao cliente
                },
            },
        });

        res.status(201).json(newPet); // Retorne o pet criado
    } catch (error) {
        console.error('Erro ao adicionar pet:', error);
        res.status(500).json({ message: 'Erro ao adicionar pet', error: error.message });
    }
});

app.get('/clients/:id/pets', async (req, res) => {
    const { id } = req.params;

    try {
        const pets = await prisma.pet.findMany({
            where: { ownerId: id }, // Certifique-se de que o campo `ownerId` está correto no schema
        });
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pets', error });
    }
});

// Editar pet
app.put('/clients/:clientId/pets/:petId', async (req, res) => {
    const { clientId, petId } = req.params;
    const { name, species, breed, age } = req.body;

    try {
        // Verificar se o cliente existe
        const client = await prisma.client.findUnique({
            where: { id: clientId },
        });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Verificar se o pet existe
        const pet = await prisma.pet.findUnique({
            where: { id: petId },
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }

        // Atualizar o pet
        const updatedPet = await prisma.pet.update({
            where: { id: petId },
            data: { name, species, breed, age },
        });

        res.status(200).json(updatedPet); // Retorna o pet atualizado
    } catch (error) {
        console.error('Erro ao editar pet:', error);
        res.status(500).json({ message: 'Erro ao editar pet', error });
    }
});

// Excluir pet
app.delete('/clients/:clientId/pets/:petId', async (req, res) => {
    const { clientId, petId } = req.params;

    try {
        // Verificar se o cliente existe
        const client = await prisma.client.findUnique({
            where: { id: clientId },
        });

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Verificar se o pet existe
        const pet = await prisma.pet.findUnique({
            where: { id: petId },
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet não encontrado' });
        }

        // Excluir o pet
        await prisma.pet.delete({
            where: { id: petId },
        });

        res.status(204).send(); // Pet excluído com sucesso
    } catch (error) {
        console.error('Erro ao excluir pet:', error);
        res.status(500).json({ message: 'Erro ao excluir pet', error });
    }
});

//Agendamentos
app.post('/appointments', async (req, res) => {
    const { date, clientId, petId, service, clientName, petName } = req.body;

    try {
        const newAppointment = await prisma.appointment.create({
            data: {
                date: new Date(date),
                client: { connect: { id: clientId } },
                pet: { connect: { id: petId } },
                service,
                clientName: clientName,  // Preenche com o nome do cliente
                petName: petName,        // Preenche com o nome do pet
            },
            include: {
                client: true,
                pet: true,
            },
        });

        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ message: 'Erro ao criar agendamento', error });
    }
});

app.get('/appointments', async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                client: true, // Inclui os dados do cliente associado
                pet: true,    // Inclui os dados do pet associado
            },
        });
        console.log(appointments);
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
        res.status(500).json({ message: 'Erro ao buscar agendamentos', error: error.message });
    }
});

app.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { date, service } = req.body;
  
    try {
      const updatedAppointment = await prisma.appointment.update({
        where: { id },
        data: { date: new Date(date), service },
      });
      res.status(200).json(updatedAppointment);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      res.status(500).json({ message: 'Erro ao atualizar agendamento', error });
    }
  });
  
  app.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await prisma.appointment.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
      res.status(500).json({ message: 'Erro ao excluir agendamento', error });
    }
  });
  
  //Users
  app.post('/users/register', async (req, res) => {
    const { name, email, password, role, crm } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                ...(role === 'VETERINARIO' && { crm }),
            },
        });

        res.status(201).json({ message: 'Usuário criado com sucesso!', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
});

app.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error('Usuário não encontrado:', email);
            return res.status(401).json({ message: 'Usuário não encontrado!' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            console.error('Senha inválida para o email:', email);
            return res.status(401).json({ message: 'Senha inválida!' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            'JWT_SECRET', // Substitua pelo valor da variável de ambiente
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        console.error('Erro inesperado durante o login:', error);
        res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          crm: true, // Incluímos o CRM, caso seja um veterinário
          createdAt: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  });
  
  // Rota PUT para atualizar um usuário
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, crm } = req.body;
  
    try {
      // Atualiza o usuário no banco de dados
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
          role,
          crm: role === 'VETERINARIAN' ? crm : null, // Apenas veterinários têm CRM
        },
      });
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
  });
  
  // Rota DELETE para remover um usuário
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Deleta o usuário no banco de dados
      await prisma.user.delete({
        where: { id },
      });
  
      res.status(204).send(); // Retorna uma resposta sem conteúdo indicando sucesso
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ message: 'Erro ao deletar usuário', error: error.message });
    }
  });

//medical-records
app.post('/medical-records', async (req, res) => {
    try {
      const { date, type, description, petId, vetId } = req.body;
  
      // Verifica se o pet e o veterinário existem
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
        include: {
          owner: true, // Inclui informações do proprietário
        },
      });
      const vet = await prisma.user.findUnique({
        where: { id: vetId },
      });
  
      if (!pet || !vet) {
        return res.status(404).json({ message: 'Pet ou veterinário não encontrado.' });
      }
  
      // Criação do registro médico
      const newRecord = await prisma.medicalRecord.create({
        data: {
          date: new Date(date),
          type,
          description,
          petId,
          vetId,
          petName: pet.name, // Preenche o nome do pet
          ownerId: pet.owner.id, // Preenche o ID do proprietário
          ownerName: pet.owner.name, // Preenche o nome do proprietário
        },
        include: {
          pet: { select: { name: true } },
          vet: { select: { name: true } },
        },
      });
  
      res.status(201).json(newRecord);
    } catch (error) {
      console.error('Erro ao criar registro médico:', error);
      res.status(500).json({ message: 'Erro ao criar registro médico.', error: error.message });
    }
  });
  
  app.get('/medical-records', async (req, res) => {
    try {
      const records = await prisma.medicalRecord.findMany({
        include: {
          pet: { select: { name: true } }, // Inclui o nome do pet
          owner: { select: { name: true } }, // Inclui o nome do proprietário
          vet: { select: { name: true } }, // Inclui o nome do veterinário
        },
      });
  
      res.status(200).json(records);
    } catch (error) {
      console.error('Erro ao buscar registros médicos:', error);
      res.status(500).json({ message: 'Erro ao buscar registros médicos.', error: error.message });
    }
  });
  
  
  
  // Atualizar um registro médico
  app.put('/medical-records/:id', async (req, res) => {
    const { id } = req.params;
    const { petId, ownerId, type, description, vetId } = req.body;
  
    try {
      // Verificar se o veterinário é válido
      const vet = await prisma.user.findUnique({
        where: { id: vetId },
      });
  
      if (!vet || vet.role !== 'VETERINARIO') {
        return res.status(400).json({ message: 'Apenas usuários com o papel de VETERINARIO podem ser atribuídos como veterinários.' });
      }
  
      // Obter os nomes do pet e do proprietário
      const pet = await prisma.pet.findUnique({ where: { id: petId } });
      const owner = await prisma.client.findUnique({ where: { id: ownerId } });
  
      if (!pet || !owner) {
        return res.status(404).json({ message: 'Pet ou Cliente não encontrado.' });
      }
  
      // Atualizar o registro médico
      const updatedRecord = await prisma.medicalRecord.update({
        where: { id },
        data: {
          petId,
          ownerId,
          vetId,
          type,
          description,
          petName: pet.name, // Atualizar o nome do pet
          ownerName: owner.name, // Atualizar o nome do proprietário
        },
      });
  
      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar registro médico', error: error.message });
    }
  });

  app.delete('/medical-records/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedRecord = await prisma.medicalRecord.delete({
        where: { id },
      });
  
      res.status(200).json({ message: 'Registro médico excluído com sucesso!', deletedRecord });
    } catch (error) {
      console.error('Erro ao excluir registro médico:', error);
      res.status(500).json({ message: 'Erro ao excluir registro médico.', error: error.message });
    }
  });

app.listen(3000)