
import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu } from 'lucide-react'
import { Flex, Text, Box, Button } from '../flow'

interface PublicHeaderProps {
  onSearchClick: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onSearchClick }) => {
  return (
    <Box as="header" position="fixed" zIndex={150} width="100%" bg="white" border="1px solid #E5E5E5">
      <Flex maxWidth="1280px" mx="auto" px={2} height="80px" align="center" justify="between">
        <Link to="/">
          <Text variant="h2" weight="bold" style={{ letterSpacing: '-0.04em' }}>ArtFlow</Text>
        </Link>

        <Flex as="nav" gap={3} align="center" className="hidden lg:flex">
          <Link to="/artworks"><Text variant="label" color="#666">Artworks</Text></Link>
          <Link to="/artists"><Text variant="label" color="#666">Artists</Text></Link>
          <Link to="/catalogues"><Text variant="label" color="#666">Catalogues</Text></Link>
          <Link to="/community"><Text variant="label" color="#666">Community</Text></Link>
        </Flex>

        <Flex gap={2} align="center">
          <Button variant="no-border" onClick={onSearchClick} className="hidden md:flex">
            <Search size={20} />
          </Button>
          <Link to="/auth">
            <Button variant="secondary" size="sm">Log in</Button>
          </Link>
          <Link to="/auth">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
          <Box className="lg:hidden" ml={1}>
            <Menu size={24} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}

export default PublicHeader
