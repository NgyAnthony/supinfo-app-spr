import { getSession } from '@auth0/nextjs-auth0';
import {
    Badge,
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
    Tr
} from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import Image from 'next/image'
import logoSupinfo from '../public/logo-supinfo.png'

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
            <Badge colorScheme='red'>Il vous manque encore {20 - sumOfPoints} pour valider.</Badge>
        )
    }
}

export default function Home({ user, points }) {
    const sumOfPoints = sumPoints(points)
    if (user) {
        return (
            <Container p={6}>
                <Image
                    src={logoSupinfo}
                    alt="Logo de Supinfo"
                    width={150}
                    height={150}
                />
                <Heading mt={6}>Profil</Heading>
                <Text fontSize='2xl'>Bonjour, {user.name}</Text>
                <Divider mb={4} mt={4}/>
                <Text fontSize='md'>XLIF est une matière vous rapportant 3 crédits ECTS. Vous validez la matière en ayant au minimum 10 points sur 20. Chaque évènement (Journée Portes Ouvertes, Salon étudiant, accompagnement étudiant, visite lycée...) vous rapporte un nombre de points.</Text>
                <Divider mb={4} mt={4}/>
                <Text fontSize='xl'>Voici votre relevé de points XLIF (dernière MAJ le 29 Janvier)</Text>
                {
                    getValidatedOrNot(sumOfPoints)
                }
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

                <Link href={"/api/auth/logout"}>
                    <Button colorScheme='blue'>Se déconnecter</Button>
                </Link>
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
                <Text fontSize='2xl' mb={4} mt={4}>Bienvenue sur l'outil de consultation des points XLIF du SPR Lyon.</Text>
                <Text fontSize='md' mb={4} mt={4}>Inscrivez-vous, puis connectez-vous avec votre adresse SUPINFO afin de pouvoir consulter vos points XLIF.</Text>

                <Text fontSize='sm' mb={4} mt={4}>(cliquez sur "Vous n'avez pas de compte ? Inscription" en bas)</Text>
                <Link href={"/api/auth/login"}>
                    <Button colorScheme='blue'>Se connecter</Button>
                </Link>
                <Link href={"/api/signup"} ml={4}>
                    <Button colorScheme='blue'>Inscription</Button>
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
    console.log(process.env.API_URL)
    console.log('check url')
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
