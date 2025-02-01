const express = require('express');
const { sequelize, users, Student, Admin } = require('../models/db');
const router = express.Router()

//Get tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const allUsers = await users.findAll({
            include: [
                { model: Student }, 
                { model: Admin } 
            ]
        });
        res.json(allUsers);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: "Une erreur s'est produite." });
    }
});

//Get Utilisateurs par Id
router.get('/:Id' ,async (req, res) =>{

    try{
        const id = req.params.Id
        const user = await users.findAll({where : {id}, include: [
            { model: Student }, 
            { model: Admin } 
        ]});
    res.send(user)
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: "Une erreur s'est produite." });
    }
})

//Post un utilisateur student ou admin 
router.post('/', async (req, res) => {
    const { firstname, lastname, email, birthday, entrance_date, password, type, student_number, school, year, registration_number, job } = req.body;
    const transaction = await sequelize.transaction();
    if (type === 'student') {
        const existingUser = await Student.findOne({ where: { student_number } });
        if (existingUser) {
            return res.status(400).json({ message: `L'étudiant avec le numéro '${student_number}' existe déjà` });
        }
        try {
            const newUser = await users.create({
                firstname, lastname, email, birthday, entrance_date, password, type}, { transaction });

            await Student.create({users_id: newUser.id,student_number,school,year}, { transaction });
            await transaction.commit();
            res.status(201).json({ message: `Le profil étudiant de ${firstname} ${lastname} a été créé` });
        } catch (error) {
            await transaction.rollback();
            console.error('Erreur lors de la création de l\'étudiant :', error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création." });
        }
    } else if (type === "admin"){
        const existingUser = await Admin.findOne({ where: { registration_number } });
        if (existingUser) {
            return res.status(400).json({ message: `'${firstname}'${lastname} travaille ou a déjà travaillé ici` });
        }
        try {
            const newUser = await users.create({
                firstname, lastname, email, birthday, entrance_date, password, type}, { transaction });

            await Admin.create({users_id: newUser.id,registration_number,job }, { transaction });
            await transaction.commit();
            res.status(201).json({ message: `Le profil administrateur de ${firstname} ${lastname} a été créé` });
        } catch (error) {
            await transaction.rollback();
            console.error('Erreur lors de la création de l\'administrateur :', error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création." });
        }

    }else {
        res.status(400).json({ message: "Type d'utilisateur invalide." });
    }
});

//Update un utilisateur en récupérant son Id et la data souhaitée en body
router.put('/:id', async (req, res) => {
    const { firstname, lastname, email, birthday, entrance_date, password, type, student_number, school, year, badges, registration_number, job } = req.body;
    const id = req.params.id;

    try {
        const [updatedUser] = await users.update(
            { firstname, lastname, email, birthday, entrance_date, password, type },
            { where: { id } }
        );
        if (updatedUser === 0) {
            return res.status(404).send(`Utilisateur non trouvé.`);
        }
        if (type === "student") {
            const [updatedStudent] = await Student.update(
                { student_number, school, year, badges },
                { where: { users_id: id } }
            );
            if (updatedStudent === 0) {
                return res.status(404).send(`Profil étudiant non trouvé.`);
            }
            return res.status(200).send(`L'utilisateur ${firstname} ${lastname} a été mis à jour avec les nouvelles informations.`);
        } 
        
        if (type === "admin") {
            const [updatedAdmin] = await Admin.update(
                { registration_number, job },
                { where: { users_id: id } }
            );
            if (updatedAdmin === 0) {
                return res.status(404).send(`Profil admin non trouvé.`);
            }
            return res.status(200).send(`L'utilisateur ${firstname} ${lastname} a été mis à jour avec les nouvelles informations.`);
        }
        return res.status(400).send("Type non reconnu.");
        
    } catch (error) {
        console.error('Erreur lors de la modification du user:', error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la modification." });
    }
});

//Delete un utilisateur avec son Id
router.delete('/:id', async (req,res) => {

    try{
        const id = req.params.id;
        const user = await users.findOne({where : {id}, include: [
            { model: Student }, 
            { model: Admin } 
        ]});
        if (!user) {
            return res.status(404).json({ message: "Utilisateur inexistant" });
        } else {
            await user.destroy();
        }

        res.status(200).json({ message: `l'Utilisateur numéro ${id} et ses données associées ont bien été supprimés.` });

    }catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: "Une erreur s'est produite." });
    }

});


module.exports = router;