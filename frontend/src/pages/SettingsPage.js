// src/pages/Settings.js
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { Box, Heading, VStack, Text, Link } from '@chakra-ui/react';

const Settings = () => {
  let { path, url } = useRouteMatch();

  return (
    <Box p="5">
      <Heading as="h1" mb="5">Settings</Heading>
      <VStack align="start">
        <Link to={`${url}/integrations`}>Integrations</Link>
        {/* Diğer ayarlar burada olacak */}
      </VStack>

      <Switch>
        <Route exact path={path}>
          <Text>Please select a setting option.</Text>
        </Route>
        <Route path={`${path}/integrations`}>
          <Integrations />
        </Route>
      </Switch>
    </Box>
  );
};

export default Settings;
