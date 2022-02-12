import { getSession } from '@auth0/nextjs-auth0';
import {
    Badge, Box,
    Container, Divider,
    Heading,
    Link,
    List,
    ListIcon,
    ListItem,
    Table,
    Tbody, Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr, useToast
} from '@chakra-ui/react'
import { Button, ButtonGroup, chakra } from '@chakra-ui/react'
import Image from 'next/image'
import logoSupinfo from '../public/logo-supinfo.png'
import { LoginOutlined, FormOutlined, LogoutOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import {useState} from "react";

function convert(obj) {
    return Object.keys(obj).map(key => ({
        eventName: key,
        value: obj[key],
    }));
}
function isNumber(val){
    return typeof val==='number';
}

const sumPoints = (points) => {
    let pointsSum = 0
    points.map(x => {
        if (isNumber(x.value)) {
            pointsSum += x.value
        }
    })
    return pointsSum
}
const getValidatedOrNot = (sumOfPoints) => {
    if (sumOfPoints >= 10) {
        return (
            <Badge colorScheme='green'>Félicitations ! Vous avez validé XLIF.</Badge>
        )
    } else {
        return (
            <Badge colorScheme='red'>Il vous manque encore {10 - sumOfPoints} pour valider.</Badge>
        )
    }
}

export default function Home({ user, points }) {
    const sumOfPoints = sumPoints(points)
    const toast = useToast()
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const handleClick = async () => {
        setEmailVerificationLoading(true)
        const emailJob = await fetch( `/api/send-verification-email/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await emailJob.json();
        if (data) {
            setEmailVerificationLoading(false)
            toast({
                title: 'Mail envoyé !',
                description: "Le mail a été envoyé, vérifiez vos spams !",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
    }

    if (user) {
        if (!user.email_verified){
            return (
                <Container p={6}>
                    <Image
                        src={logoSupinfo}
                        alt="Logo de Supinfo"
                        width={150}
                        height={150}
                    />
                    <Heading mt={6}><LockOutlined /> Validez votre email.</Heading>
                    <Text fontSize='2xl'>Bonjour, {user.name}. Veuillez valider votre email. Vérifiez vos spams.</Text>
                    <Box mt={4}>
                        <Button leftIcon={<MailOutlined />} isLoading={emailVerificationLoading}
                                colorScheme='teal' variant='solid' onClick={handleClick}>
                            Renvoyer le mail de vérification
                        </Button>

                        <Link href={"/api/auth/logout"} style={{ textDecoration: 'none' }} ml={2}>
                            <Button rightIcon={<LogoutOutlined />} colorScheme='blue'>Se déconnecter</Button>
                        </Link>
                    </Box>
                </Container>
            )
        } else {
            return (
                <Container p={6}>
                    <Image
                        src={logoSupinfo}
                        alt="Logo de Supinfo"
                        width={150}
                        height={150}
                    />
                    <Heading mt={6}><UserOutlined /> Profil</Heading>
                    <Text fontSize='2xl'>Bonjour, {user.name}</Text>
                    <Text fontSize='md' as='i'>Contactez teamspr@mail.supinfo.com en cas d'anomalie.</Text>
                    <Divider mb={4} mt={4}/>
                    <Text fontSize='md'>XLIF est une matière vous rapportant 3 crédits ECTS. Vous validez la matière en ayant au minimum 10 points sur 20. Chaque évènement (Journée Portes Ouvertes, salon étudiant, accompagnement étudiant, visite lycée...) vous rapporte un nombre de points.</Text>
                    <Divider mb={4} mt={4}/>
                    <Text fontSize='xl'>Voici votre relevé de points XLIF (dernière MAJ le 12 Février)</Text>
                    {
                        getValidatedOrNot(sumOfPoints)
                    }
                    <Text
                        bgGradient="linear(to-l, #7928CA, #FF0080)"
                        bgClip="text"
                        fontSize="xl"
                        fontWeight="extrabold"
                    >Vous avez {sumOfPoints} points XLIF.</Text>

                    <Table size='sm' mt={4} mb={4}>
                        <Thead>
                            <Tr>
                                <Th>Évènement</Th>
                                <Th isNumeric>Points acquis</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {points.map(x => {
                                return (
                                    <Tr key={x.eventName}>
                                        <Td>{x.eventName}</Td>
                                        <Td isNumeric>{x.value}</Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                        <Tfoot>
                            <Tr>
                                <Th>Total:</Th>
                                <Th isNumeric>{sumOfPoints}</Th>
                            </Tr>
                        </Tfoot>
                    </Table>

                    <Link href={"/api/auth/logout"} style={{ textDecoration: 'none' }}>
                        <Button rightIcon={<LogoutOutlined />} colorScheme='blue'>Se déconnecter</Button>
                    </Link>
                </Container>
            )
        }
    } else {
        return (
            <Container p={6}>
                <Image
                    src={logoSupinfo}
                    alt="Logo de Supinfo"
                    width={150}
                    height={150}
                />
                <Text fontSize='2xl' mb={4} mt={4}>Bienvenue sur l'outil de consultation des points XLIF du SPR Lyon.</Text>
                <Text fontSize='md' mb={4} mt={4}>
                    <chakra.span
                        bgGradient="linear(to-l, #7928CA, #FF0080)"
                        bgClip="text"
                        fontSize="md"
                        fontWeight="extrabold"
                    >Inscrivez-vous</chakra.span>, puis connectez-vous avec votre
                    <chakra.span
                        bgGradient="linear(to-l, #7928CA, #FF0080)"
                        bgClip="text"
                        fontSize="md"
                        fontWeight="extrabold"
                    > adresse SUPINFO</chakra.span> <MailOutlined /> afin de pouvoir consulter vos points
                    <chakra.span
                        bgGradient="linear(to-l, #7928CA, #FF0080)"
                        bgClip="text"
                        fontSize="md"
                        fontWeight="extrabold"
                    > XLIF.
                    </chakra.span>
                    </Text>
                <Link href={"/api/auth/login"} style={{ textDecoration: 'none' }}>
                    <Button leftIcon={<LoginOutlined />} colorScheme='blue'>Se connecter</Button>
                </Link>
                <Link href={"/api/signup"} ml={4} style={{ textDecoration: 'none' }}>
                    <Button leftIcon={<FormOutlined />} colorScheme='teal'>Inscription</Button>
                </Link>
            </Container>
        )
    }
}

export async function getServerSideProps(ctx) {
    const { req, res } = ctx;
    const session = getSession(req, res);

    const fetchPointsBody = {
        user: session?.user
    }

    const points = await fetch( process.env.API_URL + `/user/points/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fetchPointsBody),
    });

    const data = await points.json();
    let eventArray = convert(data)

    return {
        props: { user: session?.user ?? null, points: eventArray }
    }
}
