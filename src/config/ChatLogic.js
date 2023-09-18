const getSender = (loggedUser, users) => {
    

    return users[0]._id === loggedUser._id ? users[1].AgencyName : users[0].AgencyName;
};

export default getSender;