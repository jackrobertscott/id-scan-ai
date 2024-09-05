import {Field} from "../../theme/Field"
import {FieldGroup} from "../../theme/FieldGroup"
import {InputStatic} from "../../theme/InputStatic"
import {Spacer} from "../../theme/Spacer"
import {toSentenceCase} from "../../utils/changeCase"
import {FaceMetaSchema} from "../../utils/faceMetaSchema"

export type ReadScanFaceProps = {
  faceMeta: FaceMetaSchema
}

export const ReadScanFace = ({faceMeta}: ReadScanFaceProps) => {
  return (
    <FieldGroup label="Patron Details">
      <Spacer direction="row" slim mobileCollapse>
        <Spacer direction="column" slim>
          {faceMeta.gender && (
            <Field label="Gender">
              <InputStatic label={toSentenceCase(faceMeta.gender.value)} />
            </Field>
          )}

          {faceMeta.ageRange && (
            <Field label="Age Range">
              <InputStatic
                label={faceMeta.ageRange.low + " to " + faceMeta.ageRange.high}
              />
            </Field>
          )}

          {faceMeta.primaryEmotion && (
            <Field label="Primary Emotion">
              <InputStatic
                label={toSentenceCase(faceMeta.primaryEmotion.value)}
              />
            </Field>
          )}

          {faceMeta.smile && (
            <Field label="Smile">
              <InputStatic label={faceMeta.smile.value ? "Yes" : "No"} />
            </Field>
          )}

          {faceMeta.eyeglasses && (
            <Field label="Eyeglasses">
              <InputStatic label={faceMeta.eyeglasses.value ? "Yes" : "No"} />
            </Field>
          )}
        </Spacer>

        <Spacer direction="column" slim>
          {faceMeta.sunglasses && (
            <Field label="Sunglasses">
              <InputStatic label={faceMeta.sunglasses.value ? "Yes" : "No"} />
            </Field>
          )}

          {faceMeta.beard && (
            <Field label="Beard">
              <InputStatic label={faceMeta.beard.value ? "Yes" : "No"} />
            </Field>
          )}

          {faceMeta.mustache && (
            <Field label="Mustache">
              <InputStatic label={faceMeta.mustache.value ? "Yes" : "No"} />
            </Field>
          )}

          {faceMeta.eyesOpen && (
            <Field label="Eyes Open">
              <InputStatic label={faceMeta.eyesOpen.value ? "Yes" : "No"} />
            </Field>
          )}

          {faceMeta.mouthOpen && (
            <Field label="Mouth Open">
              <InputStatic label={faceMeta.mouthOpen.value ? "Yes" : "No"} />
            </Field>
          )}
        </Spacer>
      </Spacer>
    </FieldGroup>
  )
}
