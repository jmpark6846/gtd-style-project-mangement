import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Subscribe } from "unstated";
import ProjectContainer from "../../containers/ProjectContainer";

function Breadcumb({ projectId, listId }) {
  return (
    <Subscribe to={[ProjectContainer]}>
      {({ state: { projects, lists } }) => {
        const projectName = projectId ? projects[projectId].name : null
        const listHeading = listId ? lists[projectId][listId].heading : null
        return (
        <span>
          <Link to={`/projects`}>Projects</Link>
          {projectName && (
            <React.Fragment>
              <span>></span>
              <Link to={`/projects/${projectId}`}>{projectName}</Link>
            </React.Fragment>
          )}
          {projectName && listHeading && (
            <React.Fragment>
              <span>></span>
              <Link to={`/projects/${projectId}/lists/${listId}`}>
                {listHeading}
              </Link>
            </React.Fragment>
          )}
          </span>
        )}}
    </Subscribe>
  );
}

Breadcumb.propTypes = {};

export default Breadcumb;
