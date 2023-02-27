import React, { useState, SetStateAction, Dispatch, useContext } from 'react';
import { loadImageToStorage } from '../../firebase/storage';

import './modal.scss';

type CallBackType = (url: string, imageId: string) => void;

interface Props {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  callback: CallBackType;
  type: 'avatar' | 'photos';
  setCaption?: Dispatch<SetStateAction<string>>;
}

export default function UploadImageModal({
  callback,
  type,
  setShowModal,
  setCaption,
}: Props) {
  const [imgUpload, setImgUpload] = useState<File | null>(null);
  const [imgError, setImgError] = useState('');
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string | undefined| null>(null);
  const reader = new FileReader();

  const handleUpload = (filesList: FileList | null): void => {
    const img = filesList ? filesList[0] : null;
    setImgError('');

    if (!img) {
      setImgError('Please select file!');
      return;
    }

    if (!img.type.includes('image')) {
      setImgError('Please select image file');
      return;
    }

    if (img) {
      reader.readAsDataURL(img);
      reader.addEventListener("load", function() {
        const url = reader.result;
        setImagePreviewSrc(url?.toString());
      });
    }

    setImgError('');
    setImgUpload(img);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!imgUpload) {
      setImgError('Please select file!');
      return;
    }

    loadImageToStorage(imgUpload, callback);
  };

  return (
    <div className='modal'>
      <div className='modal__inner'>
        <header className='modal__header'>
          <h3 className='modal__title'>{type === 'avatar' ? 'Update Avatar!' : 'Upload Image!'}</h3>
          {imgError && <p>{imgError}</p>}
        </header>
        <form
          className='modal__body form'
          onSubmit={handleSubmit}
        >
          <div className='form__image-wrapper'>
            { imagePreviewSrc ? (
              <img className='form__image' src={imagePreviewSrc} />
              ): <img className='form__image form__image--default' src={'./images/placeholder-image.png'}/>
            }
            {/* <img className='form__image' src={imagePreviewSrc ? imagePreviewSrc : './images/placeholder-image.png'} /> */}
            <input className='form__file' type="file" onChange={(e) => handleUpload(e.target.files)} />
            { !imagePreviewSrc ? (
              <button className='form__action button button--primary' type='button'>Load file</button>
              ) : null
            }
          </div>
          <footer className='form__footer'>
            {setCaption ? (
              <textarea
                className='form__text'
                placeholder="Your caption:"
                rows={3}
                onChange={(e) => setCaption(e.target.value.trim())}
              />
            ) : null}

            <button className='button button--primary' type="submit">
              {type === 'avatar' ? 'Update Avatar!' : 'Upload Image!'}
            </button>
          </footer>
        </form>
          <button
            className='modal__close'
            type="button"
            onClick={(e) => {
              setShowModal(false);
              setImgUpload(null);
            }}
          >
          </button>
      </div>
    </div>
  );
}
