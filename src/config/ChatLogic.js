const getSender = (loggedUser, users) => {
    const {Agency} = loggedUser;

    return users[0]._id === Agency._id ? users[1].AgencyName : users[0].AgencyName;
};

export default getSender;