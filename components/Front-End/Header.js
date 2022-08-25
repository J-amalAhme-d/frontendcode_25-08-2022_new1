import styles from "../../styles/Home.module.css"

import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { Amplify, Auth } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
import awsconfig from "../../src/aws-exports";
Amplify.configure(awsconfig);

import { useEffect, useState } from "react";
import Image from 'next/image'
import StorageUtils from "../../src/utils/StorageUtils";
import UserUtils from "../../src/utils/UserUtils";
import Link from "next/link";

const Header = () => {

  const [isLoading, setIsLoading] = useState(null);
  const [userRole, setUserRole] = useState("Guest");
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    updateUserStatus();
    setIsLoading(false);
  },[])

  const updateUserStatus = () => {
    UserUtils.getAuthenticatedUser()
    .then(aUser => {
      if(userInfo && userInfo !== null){
        if(aUser.email !== userInfo.email){
          setUserInfo(aUser);
          setIsLoggedIn(true);
          updateUserRole(aUser.email);
        } 
      }else {
        setUserInfo(aUser);
        setIsLoggedIn(true);
        updateUserRole(aUser.email);
      }
    })
  }

  const updateUserRole = (email) => {
    UserUtils.getUserRole(email)
      .then(rolR => {
        let role = StorageUtils.getLocalStorageObject("UserRole");
        if(role && role !== null && role !== "") { 
          if(role !== rolR){
            setUserRole(rolR);
          }  
        } else {
          setUserRole(rolR);
        }
      })
  }

  const getProfilePath = () => {
    if(userRole === "Player"){
      return "/PlayerProfilePage";
    } else if(userRole === "Coach"){
      return "/CoachProfilePage";
    } 
  }

  const signOut = () => {
    Auth.signOut()
    .then(data => {
      console.log("User Signed Out")
      StorageUtils.setLocalStorageObject("UserRole","");
      StorageUtils.setLocalStorageObject("usid","");
    })
    .catch(err => console.error(err));
  }

  return  (
    <Container className="mt-4">
      <Row align="center">
        <Col sm={10} align="center">
        <Link href="/">
          <Image 
            className={styles.logo} 
            width="300"
            height="80"
            src="/images/true-tryouts-logo.png" 
            alt="TrueTryouts Logo" />
        </Link>
        </Col>
        {
          isLoading !== null?
            !isLoading && isLoggedIn?
              <Col>
                <span>
                  <span>Hi {userInfo.given_name}</span>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                      <Image 
                        className={styles.logo} 
                        width="35"
                        height="35"
                        src="/images/guest.png" 
                        alt="Guest profile picture" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/ViewProfilePage">Profile</Dropdown.Item>
                      <Dropdown.Item 
                        href={getProfilePath()}>
                        Profile Settings
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={ signOut }>
                        Sign out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </span>
              </Col>
              :
              <Col>
                <span>
                  <span>Hi Guest</span>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                      <Image 
                        className={styles.logo} 
                        width="35"
                        height="35"
                        src="/images/guest.png" 
                        alt="Guest profile picture" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/ViewProfilePage">Profile</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </span>
              </Col>
          :
          <p>Loading...</p>
        }
      </Row> 
    </Container>
  )

} 

export default Header;