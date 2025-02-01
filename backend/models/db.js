const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('nextu_app', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    define: {
        timestamps: false,
    }
});

const users = sequelize.define('users', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    entrance_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {  
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'users',
    timestamps: false,
});

const Student = sequelize.define('Student', {
    student_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    school: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    users_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: users,
            key: 'id',
        }
    },
    badges: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [], 
    }
    
}, {
    tableName: 'student',
    timestamps: false,
});

const Admin = sequelize.define('Admin', {
    registration_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    job: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    users_id: {  
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: users,
            key: 'id',
        }
    }
}, {
    tableName: 'admin',
    timestamps: false,
});


const Posts = sequelize.define('Posts', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    creation_date: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW 
      },
    description: {
        type: DataTypes.TEXT,
    }
});


const Media = sequelize.define('Media', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Posts,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    url_media: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
});


const Sondage = sequelize.define('Sondage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Posts,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
});


const Reponse = sequelize.define('Reponse', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sondage_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Sondage,
            key: 'id'
        }
    },
    text: {
        type: DataTypes.STRING(255),
        allowNull: false,
    }
});


const Vote = sequelize.define('Vote', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    reponse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Reponse,
            key: 'id'
        }
    }
});

//users clés étrangères
Student.belongsTo(users, { foreignKey: 'users_id', onDelete: 'CASCADE' });
Admin.belongsTo(users, { foreignKey: 'users_id', onDelete: 'CASCADE' });
users.hasOne(Student, { foreignKey: 'users_id' });
users.hasOne(Admin, { foreignKey: 'users_id' });

//Posts clés étrangères
Posts.hasMany(Media, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Media.belongsTo(Posts, { foreignKey: 'post_id' });

Posts.hasMany(Sondage, { foreignKey: 'post_id', onDelete: 'CASCADE' });
Sondage.belongsTo(Posts, { foreignKey: 'post_id' });

Sondage.hasMany(Reponse, { foreignKey: 'sondage_id', onDelete: 'CASCADE' });
Reponse.belongsTo(Sondage, { foreignKey: 'sondage_id' });

Reponse.hasMany(Vote, { foreignKey: 'reponse_id', onDelete: 'CASCADE' });
Vote.belongsTo(Reponse, { foreignKey: 'reponse_id' });


module.exports = { sequelize, users, Student, Admin, Posts, Media, Sondage, Reponse, Vote };
