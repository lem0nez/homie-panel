class Piano<Type> {
  piano: Type;
}

const RECORDINGS = `{
  piano {
    recordings {
      id
      apiEndpoint
      humanCreationDate
      humanDuration
    }
  }
}`;

class Recordings {
  recordings: Recording[];
}

class Recording {
  id: number;
  apiEndpoint: string;
  humanCreationDate: string;
  humanDuration: string;
}

const PLAY_RECORDING = `
  query ($id: Int64!) {
    piano {
      playRecording(id: $id)
    }
  }
`;
