import * as OriginalJoi from 'joi';
import { messages } from 'joi-translation-pt-br';

export default OriginalJoi.defaults((schema) => {
  return schema.options({
    messages,
    errors: {
      wrap: {
        label: "'",
      },
    },
  });
});
