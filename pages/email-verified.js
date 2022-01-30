import {Container, Link, Text} from "@chakra-ui/react";
import {useEffect} from "react";
import { CheckCircleOutlined } from '@ant-design/icons';
import { Button } from '@chakra-ui/react'
import Router from 'next/router'

export default function EmailVerified() {
    useEffect(() => {
        setTimeout(
            function() {
                Router.push('/')
            }, 1600);
    }, [])

    return (
        <Container p={6}>
            <Text fontSize='2xl'><CheckCircleOutlined /> Email vérifié ! Redirection dans 3 secondes...</Text>
            <Link to="/" onClick={() => window.location.reload()}>
                <Button colorScheme='blue'>Rediriger vers l'accueil</Button>
            </Link>
        </Container>
    )
}
