import React from 'react';
import { useSelector } from 'react-redux';
import Add from './Add.jsx';
import Rename from './Rename.jsx';
import Remove from './Remove.jsx';

const modals = {
  adding: Add,
  renaming: Rename,
  removing: Remove,
};

const ModalManager = () => {
  const { type } = useSelector((state) => state.modal);

  if (!type) {
    return null;
  }

  const Component = modals[type];
  return <Component />;
};

export default ModalManager;
