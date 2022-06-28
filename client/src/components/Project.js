import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import styled from 'styled-components';

import useProject from '../hooks/use-project.hook.js';

import abcjs from 'abcjs';
// import Abcjs from 'react-abcjs';
import { saveAsPng, saveAsJpeg } from 'save-html-as-image';
import AbcTines from './abc/AbcTines.js';
import AbcSetNumberOfTines from './abc/AbcSetNumberOfTines';
import AbcSelectToneRow from './abc/AbcSelectToneRow';
import AbcKeyDefinitions from './abc/AbcKeyDefinitions.js';

import AbcSetBeatsPerMeasure from './abc/AbcSetBeatsPerMeasure';
import AbcSetTempo from './abc/AbcSetTempo';
import AbcSetOrderOfSections from './abc/AbcSetOrderOfSections';
import AbcSetKey from './abc/AbcSetKey';
import AbcSelectTune from './abc/AbcSelectTune.js';
import AbcSelectThumb from './abc/AbcSelectThumb.js';
import AbcSetNumberOfMusicalSections from './abc/AbcSetNumberOfMusicalSections.js';
import AbcMusicalSection from './abc/AbcMusicalSection.js';

import AbcNoteGrid from './abc/AbcNoteGrid.js';
import AbcFinalPiece from './abc/AbcFinalPiece.js';
import AbcSetProjectName from './abc/AbcSetProjectName.js';
import AbcDescription from './abc/AbcDescription.js';
import AbcProjectVisibility from './abc/AbcProjectVisibility.js';

//AbcThumbOneOrTwo

import { AppContext } from './AppContext';

const Project = () => {
  const { projectid, created } = useParams();

  const {
    userId,
    dateFromMs,
    tines,
    musicalSections,
    hideAllSections,
    projectName,
    projectDescription,
    printDivById,
    currentUser,
    saveNewProject,
    projectVisibility,
    orderOfSections,
    tempo,
    key,
    beatsPerMeasure,
    objToToneRowStr,
    setAudioContext,
    setBeatsPerMeasure,
    setTines,
    toneRowStrToObj,
    setThumbOneOrTwo,
    setMusicalSections,
    setTempo,
    setKey,
    setProjectName,
    setProjectDescription,
    setHideAllSections,
    setOrderOfSections,
    setProjectVisibility,
  } = useContext(AppContext);

  // check if the path starts with /myproject/
  const myProject =
    window.location.pathname.match(/^\/([a-z]+)\//)[1] === 'myprojects';

  //if it is "myProject", it will load a project to be edited by current user with all permissions, assuming current user has permission to edit it; otherwise, it will attempt to load it as a public project, which can be forked
  const [project, setProject] = useProject(
    projectid,
    null,
    myProject ? userId : null
  );

  // update values in AppContext when project changes to a different one
  useEffect(() => {
    // console.log('useEffect', { project });
    // setAudioContext(new window.AudioContext());
    setBeatsPerMeasure(project ? project.beatsPerMeasure : 4);
    setTines(
      toneRowStrToObj(
        project ? project.toneRowStr : '5 tones (c d e f g) [awsed]'
      )
    );
    setThumbOneOrTwo(1);
    setMusicalSections(
      project
        ? project.musicalSections
        : [
            {
              letterId: 'A',
              description: '',
              numberOfMeasures: 2,
              measures: [
                [
                  [1, 0, 0, 0],
                  [0, 2, 0, 0],
                  [0, 0, 1, 0],
                  [0, 0, 0, 2],
                ],
                [
                  [0, 1, 0, 0],
                  [0, 0, 2, 0],
                  [0, 1, 0, 0],
                  [2, 0, 0, 0],
                ],
              ],
            },
          ]
    );
    setTempo(project ? project.tempo : 180);
    setKey(project ? project.key : 'C');
    setProjectName(project ? project.projectName : '');
    setProjectDescription(project ? project.projectDescription : '');
    setHideAllSections(false);
    setOrderOfSections(project ? project.orderOfSections : 'AA');
    setProjectVisibility(project ? project.projectVisibility : 'private');

    // cleanup
    return () => {
      // setProject(null);
      setBeatsPerMeasure('4');
      setTines(
        toneRowStrToObj(
          project ? project.toneRowStr : '5 tones (c d e f g) [awsed]'
        )
      );
      setThumbOneOrTwo(1);
      setMusicalSections([
        {
          letterId: 'A',
          description: '',
          numberOfMeasures: 2,
          measures: [
            [
              [1, 0, 0, 0],
              [0, 2, 0, 0],
              [0, 0, 1, 0],
              [0, 0, 0, 2],
            ],
            [
              [0, 1, 0, 0],
              [0, 0, 2, 0],
              [0, 1, 0, 0],
              [2, 0, 0, 0],
            ],
          ],
        },
      ]);
      setTempo(180);
      setKey('C');
      setProjectName('');
      setProjectDescription('');
      setHideAllSections(false);
      setOrderOfSections('AA');
      setProjectVisibility('private');
    };
  }, [project]);

  return (
    <Wrapper>
      {projectName && (
        <ProjectName>
          {projectName} - {myProject ? 'My Project' : 'Another Project'}
        </ProjectName>
      )}
      {projectDescription && <Description>{projectDescription}</Description>}
      <AbcSetNumberOfTines />
      <AbcSelectToneRow />
      <AbcKeyDefinitions />
      <AbcTines />
      <HorizontalWrapper>
        <AbcSetNumberOfMusicalSections />
        <AbcSetBeatsPerMeasure />
        <AbcSetTempo />
        {/* <AbcSetKey /> // TODO, no sense in adding this in until the abc notes are actually modified based on what the key is */}
      </HorizontalWrapper>
      <HorizontalWrapper>
        <AbcSelectThumb />
        <StyledButton onClick={() => setHideAllSections(!hideAllSections)}>
          {hideAllSections ? 'Unhide' : 'Hide'} all sections
        </StyledButton>
      </HorizontalWrapper>
      {musicalSections.map((section, i) => (
        <AbcMusicalSection
          key={i}
          currentMusicalSectionIndex={i}
          letterId={section.letterId}
          numberOfMeasures={section.numberOfMeasures}
        />
      ))}
      <AbcFinalPiece />
      <AbcSetProjectName />
      <AbcDescription />
      {myProject && <AbcProjectVisibility />}
      <StyledButton2
        onClick={() => {
          myProject
            ? console.log('myproject')
            : saveNewProject(
                projectName,
                projectDescription,
                projectVisibility,
                objToToneRowStr(tines),
                musicalSections,
                orderOfSections,
                tempo,
                key,
                beatsPerMeasure,
                currentUser.username
              );
        }}
      >
        {myProject ? 'Update' : 'Save'} project
      </StyledButton2>
      <StyledButton2 onClick={() => printDivById('final-score')}>
        Print music score
      </StyledButton2>
    </Wrapper>
  );
};

// display flex makes it not work
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px auto;
  height: 660px;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProjectName = styled.p`
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-big);
  text-align: center;
  margin: 8px;
`;

const Description = styled.p`
  color: black;
  font-family: var(--font-heading);
  font-size: var(--font-size-smaller);
  text-align: left;
  margin-bottom: 12px;
`;

const StyledButton = styled.button`
  font-size: var(--font-size-smaller);
  margin: 10px;
`;

const StyledButton2 = styled(StyledButton)`
  font-size: var(--font-size-small);
  margin: 10px 0 0 0;
`;

export default Project;
