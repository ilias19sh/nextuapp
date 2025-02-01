const express = require('express');
const { sequelize, Posts, Media, Sondage, Reponse } = require('../models/db');
const router = express.Router()

//Get toutes les publications
router.get('/', async (req, res) => {
    try {
        const allPosts = await Posts.findAll({
            include: [
                { model: Media }, 
                { model: Sondage, include: [{ model: Reponse}] }
            ]
        });
        res.json(allPosts);
    } catch (error) {
        console.error('Erreur lors de la récupération des Publications :', error);
        res.status(500).json({ message: "Une erreur s'est produite." });
    }
});

//Get Publication par Id
router.get('/:id' ,async (req, res) =>{

    try{
        const id = req.params.id
        const publication = await Posts.findAll({where : {id}, include: [
            { model: Media }, 
            { model: Sondage, include: [{ model: Reponse}] } 
        ]});
    res.send(publication)
    } catch (error) {
        console.error('Erreur lors de la récupération de la publication :', error);
        res.status(500).json({ message: "Une erreur s'est produite." });
    }
})

//Post une publication
router.post('/', async (req, res) => {
    const { description, type, urlmedia, title, reponse } = req.body;
    const transaction = await sequelize.transaction();

    if (title) { 
        try {
            const newPost = await Posts.create({description}, { transaction });
            await Sondage.create({post_id: newPost.id,title,reponse}, { transaction });
            await transaction.commit();
            res.status(201).json({ message: 'La publication de type sondage a bien été publiée' });
        } catch (error) {
            await transaction.rollback();
            console.error('Erreur lors de la création de la publication:', error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création du sondage." });
        }

    } else if (urlmedia) { 
        try {
            const newPost = await Posts.create({description}, { transaction });
            await Media.create({post_id: newPost.id,type,url_media: urlmedia }, { transaction });
            await transaction.commit();
            res.status(201).json({ message: 'La publication de type image a bien été publiée' });
        } catch (error) {
            await transaction.rollback();
            console.error('Erreur lors de la création de la publication :', error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création du média." });
        }

    } else { 
        try {
            await Posts.create({description}, { transaction });
            await transaction.commit();
            res.status(201).json({ message: 'La publication a bien été publiée' });
        } catch (error) {
            await transaction.rollback();
            console.error('Erreur lors de la création de la publication :', error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création de la publication." });
        }
    }
});

//Update une publication
router.put('/:id', async (req,res) => {
    const { description, type, urlmedia, status } = req.body;
    const id = req.params.id;

    try {
        const [updatedPost] = await Posts.update(
            { description, status },
            { where: { id } }
        );
        if (updatedPost === 0) {
            return res.status(404).send(`Publication non trouvé.`);
        }
        if (urlmedia) {
            const [updatedMedia] = await Media.update(
                { type, urlmedia },
                { where: { post_id: id } }
            );
            if (updatedMedia === 0) {
                return res.status(404).send(`Image à modifier introuvable`);
            }
        } 
        return res.status(200).send(`La publication a bien été modifiée.`);
        
    } catch (error) {
        console.error('Erreur lors de la modification du post:', error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la modification." });
    }

});

//Delete une publication
router.delete('/:id', async (req,res) => {
    try{
        const id = req.params.id;
        const publication = await Posts.findOne({where : {id}, include: [
            { model: Media }, 
            { model: Sondage, include: [{ model: Reponse}] } 
        ]});
        if (!publication) {
            return res.status(404).json({ message: "Publication inexistante" });
        } else {

        await publication.destroy();
        }

        res.status(200).json({ message: `la publication numéro ${id} et ses données associées ont bien été supprimées.` });
    }catch (error) {
        console.error('Erreur lors de la récupération des publications :', error);
        res.status(500).json({ message: "Une erreur s'est produite." });
    }

});


module.exports = router;