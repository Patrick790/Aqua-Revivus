package org.aquarevivus.model;

public class UserCredentials
{
    private String email;
    private String password;
    private User loggedInUser;
    private static UserCredentials instance;

    public static UserCredentials getInstance()
    {
        if (instance == null)
        {
            instance = new UserCredentials();
        }
        return instance;
    }

    public UserCredentials() {}

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public User getLoggedInUser()
    {
        return loggedInUser;
    }

    public void setLoggedInUser(User loggedInUser)
    {
        this.loggedInUser = loggedInUser;
    }
}