import getConnection from './db/conMongoDB.js';

const getUsers = async () => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const users = await db.collection('users').find().toArray();
    return users;
};

const addUser = async (user) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('users').insertOne(user);
    const profile = {
        username: user.username,
        profiles: user.username,
        Friends: [],
        description: 'Añade una descripcion para su perfil',
        photo_profile: 'images/defaultprf.png',
        banner_profile: 'images/defaultbanner.png',
        collections: [
        ]
    };
    const profileResult = await db.collection('profiles').insertOne(profile);
    if (!profileResult.acknowledged) {
        throw new Error('Error al crear el perfil del usuario');
    }
    return result + profileResult;
}

const deleteUser = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('users').deleteOne({ username });
    return result;
}

const updateUser = async (username, updatedData) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('users').updateOne(
        { username },
        { $set: updatedData }
    );
    return result;
}

const getUserByUsername = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const user = await db.collection('users').findOne({ username });
    if (!user) return { found: false, message: 'Usuario no encontrado' };
    return { found: true, user };
};

const getUserByEmail = async (email) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const user = await db.collection('users').findOne({ email });
    if (!user) return { found: false, message: 'Email no encontrado' };
    return { found: true, user };
};

let users = [
    {
        username: 'admin',
        password: 'admin',
        email: 'admin@example.com'
    }
];

const getopinions = async () => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const opinions = await db.collection('opinions').find().toArray();
    return opinions;
};

const addOpinion = async (opinion) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('opinions').insertOne(opinion);
    return result;
};

const deleteOpinion = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('opinions').deleteOne({ username });
    return result;
};
const updateOpinion = async (username, updatedData) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('opinions').updateOne(
        { username },
        { $set: updatedData }
    );
    return result;
};
const getopinionByUsername = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const opinion = await db.collection('opinions').findOne({ username });
    if (!opinion) return { found: false, message: 'Opinión no encontrada' };
    return { found: true, opinion };
};
const getopinionsByMovie = async (movie) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const opinions = await db.collection('opinions').find({ movie }).toArray();
    return opinions;
}
const getopinionsbyseries = async (series) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const opinions = await db.collection('opinions').find({ series }).toArray();
    return opinions;
}
const getopinionsByRate = async (rate) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const opinions = await db.collection('opinions').find({ rate }).toArray();
    return opinions;
};

let opinions = [
    {
        username: 'admin',
        opinion: 'This is a great platform for data streaming!',
        date: new Date(),
        movie: { date: new Date(), title: 'Inception', genre: 'Sci-Fi' },
        rate: 5,
    },
    {
        username: 'user1',
        opinion: 'I love the features of StreamLytics!',
        date: new Date(),
        series: { date: new Date(), title: 'The Matrix', genre: 'Sci-Fi' },
        rate: 4.5,
    }
];

const getProfiles = async () => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const profiles = await db.collection('profiles').find().toArray();
    return profiles;
};
const addProfile = async (profile) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('profiles').insertOne(profile);
    return result;

};
const deleteProfile = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('profiles').deleteOne({ username });
    return result;
};
const updateProfile = async (username, updatedData) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('profiles').updateOne(
        { username },
        { $set: updatedData }
    );
    return result;
};
const getProfileByUsername = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const profile = await db.collection('profiles').findOne({ username });
    if (!profile) return { found: false, message: 'Perfil no encontrado' };
    return { found: true, profile };
};

const getProfileByProfile = async (profiles) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const profile = await db.collection('profiles').findOne({ profiles });
    if (!profile) return { found: false, message: 'Perfil no encontrado' };
    return { found: true, profile };
};

let profile = {
    username: 'admin',
    profiles: 'admin',
    Friends: [
        { username: 'user1', date: new Date() }
    ],
    description: 'Administrator profile with full access',
    photo_profile: 'https://example.com/photo_admin.jpg',
    banner_profile: 'https://example.com/banner_admin.jpg',
    collections: [
        {
            name: 'Admin favorites',
            type: 'favorite',
            description: 'Collection of admin resources',
            items: [
                { title: 'Admin Guide', url: 'https://example.com/admin_guide.pdf', date: new Date() },
                { title: 'Admin Tools', url: 'https://example.com/admin_tools.zip', date: new Date() }
            ]
        },
        {
            name: 'Admin collections',
            type: 'collection_finished',
            description: 'Collection of admin resources',
            items: [
                { title: 'Favorite Article', url: 'https://example.com/favorite_article.html', date: new Date() },
                { title: 'Favorite Video', url: 'https://example.com/favorite_video.mp4', date: new Date() }
            ]
        },
        {
            name: 'Admin history',
            type: 'collection_unfinished',
            description: 'History of admin activities',
            items: [
                { title: 'Admin Activity Log', url: 'https://example.com/admin_activity_log.csv', date: new Date() },
                { title: 'Admin Actions', url: 'https://example.com/admin_actions.json', date: new Date() }
            ]
        },
        {
            name: 'Admin',
            type: 'personal',
            description: 'Liked items by admin',
            items: [
                { title: 'Liked Article', url: 'https://example.com/liked_article.html', date: new Date() },
                { title: 'Liked Video', url: 'https://example.com/liked_video.mp4', date: new Date() }
            ]
        }
    ],
};

const getComments = async () => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const comments = await db.collection('comments').find().toArray();
    return comments;
};
const addComment = async (comment) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('comments').insertOne(comment);
    return result;
};
const deleteComment = async (username, movie) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('comments').deleteOne({ username, movie });
    return result;
};
const updateComment = async (username, updatedData) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const result = await db.collection('comments').updateOne(
        { username },
        { $set: updatedData }
    );
    return result;
};
const getCommentByUsername = async (username) => {
    const client = await getConnection();
    const db = client.db('StreamLytics');
    const comment = await db.collection('comments').findOne({ username });
    if (!comment) return { found: false, message: 'Comentario no encontrado' };
    return { found: true, comment };
};

let comments = [
    {
        username: 'admin',
        comment: 'Welcome to StreamLytics!',
        date: new Date(),
        likes: 0,
        dislikes: 0,
        movie: { date: new Date(), title: 'Inception', genre: 'Sci-Fi' },
        replies: [
            {
                username: 'user1',
                comment: 'Thank you!',
                date: new Date(),
                likes: 0,
                dislikes: 0
            }
        ]
    },
    {
        username: 'user1',
        comment: 'I love this platform!',
        date: new Date(),
        likes: 0,
        dislikes: 0,
        serie: { date: new Date(), title: 'Inception', genre: 'Sci-Fi' }
    }
];

export {
    getUsers,
    addUser,
    deleteUser,
    updateUser,
    getUserByUsername,
    getUserByEmail,
    addOpinion,
    deleteOpinion,
    updateOpinion,
    getopinionByUsername,
    getProfiles,
    addProfile,
    deleteProfile,
    updateProfile,
    getProfileByUsername,
    getProfileByProfile,
    getComments,
    addComment,
    deleteComment,
    updateComment,
    getCommentByUsername,
    getopinions,
    getopinionsByMovie,
    getopinionsbyseries,
    getopinionsByRate,
};

