import Head from 'next/head'
import Image from 'next/image'
import Navbar from './Components/Navbar'
import { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const [inputText, setInputText] = useState("");
    const [isThala, setIsThala] = useState(false);
    const audioRef = useRef(null);
    const modalRef = useRef(null);

    const removeSpaceAndPunctuation = (inputString) => {
        const spaceAndPunctuationRegex = /[ \t\n\r\[\]!"#$%&'()*+,-./:;<=>?@\\^_`{|}~]/g;
        const resultString = inputString.replace(spaceAndPunctuationRegex, '');
        return resultString;
    };

    const sumOfDigits = (number) => {
        const digits = number.toString().split('').map(Number);
        const sum = digits.reduce((acc, digit) => acc + digit, 0);
        return sum;
    };

    const handlePlay = () => {
        handleStop();
        audioRef.current.play();
    }

    const handleStop = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset playback time to the beginning
    };

    const formattedThalaString = (input) => {
        const strInput = String(input);
        const characters = strInput.split('');
        const formattedString = characters.join('+');
        return formattedString;
    };

    const checkThala = () => {
        if (isNaN(inputText)) {
            const stringWithoutSpaceAndPunctuations = removeSpaceAndPunctuation(inputText);
            if (stringWithoutSpaceAndPunctuations.length === 7) {
                setIsThala(true);
                handlePlay();
            }
            else setIsThala(false)
        } else {
            const digitsSum = sumOfDigits(inputText);
            if (digitsSum === 7) {
                setIsThala(true);
                handlePlay();
            }
            else setIsThala(false);
        }
    }

    const handleShare = () => {
        // Convert inputText to base64
        const base64Text = btoa(inputText);

        // Create the share link
        const shareLink = `${window.location.origin}?share=${base64Text}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareLink);

        // Display a success toast
        notify();
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const shareParam = urlParams.get('share');

        if (shareParam) {
            // Decode base64 and set inputText
            const decodedText = atob(shareParam);
            setInputText(decodedText);
        }

        audioRef.current.volume = 0.2;
        const myModal = modalRef.current;

        myModal.addEventListener('hidden.bs.modal', function () {
            handleStop();
        });

        // Cleanup: Remove the event listener when the component is unmounted
        return () => {
            myModal.removeEventListener('hidden.bs.modal', function () {
                console.log('Modal hidden listener removed');
            });
        }
    }, []);

    const notify = () => toast.success('Thala share link copied!', {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });;


    return (
        <>
            <Head>
                <title>M+S+D+H+O+N+I = 7 - Thala for a reason</title>
                <meta name="description" content="MSD - Thala for a reason" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="">
                <Navbar />
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <div className="contianer max-width mx-auto px-3">
                    <h1 className='text-center'>Thala for a reason</h1>
                    <div className="mb-3">
                        <label htmlFor="textInput" className="form-label">Enter text to check for thala</label>
                        <input value={inputText} onChange={(event) => setInputText(event.target.value)} type="text" className="form-control" id="textInput" placeholder="M+S+D+H+O+N+I" />
                    </div>
                    <center>
                        <button onClick={checkThala} type="button" className="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Check Thala
                        </button>
                        <button className="btn btn-primary mx-1" onClick={handleShare}>Share Thala</button>

                    </center>

                    <div ref={modalRef} className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">{inputText && (isThala === true ? "Thala Confirmed!" : "Not Thala")}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <center>
                                        {isThala ?
                                            <>
                                                <video id='vid' className='my-2' autoPlay loop muted>
                                                    <source src="/meme.mp4" />
                                                </video>
                                                <p className="lead">{formattedThalaString(inputText)} = 7</p>
                                                <h3 id="exampleModalLabel">{inputText && (isThala === true ? "Thala Confirmed!" : "Not Thala")}</h3>
                                            </> :
                                            <h1>Not Thala!</h1>
                                        }
                                        <audio
                                            ref={audioRef}
                                            loop
                                            src="/meme_audio.mp3">
                                            Your browser does not support the
                                            <code>audio</code> element.
                                        </audio>
                                    </center>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary" onClick={handleShare}>Share Thala</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
