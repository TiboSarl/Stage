close all
clear all

nom = "freeTexture3";

I = imread('masque_' + nom + '.png');
Itex = imread(nom + ".png");

I = imread("masque_" + nom + ".png");
[nblignes,nbcols,nbcan] = size(Itex);
Itexaug = zeros(2*nblignes,2*nbcols,nbcan);

%gauche haut
Itexaug(1:nblignes,1:nbcols,:) = Itex(:,:,:);
Iaug(1:nblignes,1:nbcols,:) = I(:,:,:);

%gauche bas
Itexaug(nblignes+1:2*nblignes,1:nbcols,:) = Itex(:,:,:);
Iaug(nblignes+1:2*nblignes,1:nbcols,:) = I(:,:,:);

%droite haut
Itexaug(1:nblignes,nbcols+1:2*nbcols,:) = Itex(:,:,:);
Iaug(1:nblignes,nbcols+1:2*nbcols,:) = I(:,:,:);

%droite bas
Itexaug(nblignes+1:2*nblignes,nbcols+1:2*nbcols,:) = Itex(:,:,:);
Iaug(nblignes+1:2*nblignes,nbcols+1:2*nbcols,:) = I(:,:,:);

figure;
imshow(Itexaug);

figure;
imshow(Iaug);

Itexaug = double(Itexaug);
Iaug = double(Iaug);

% Itexaug = Itex;
% Iaug = I;
[nblignesaug, nbcolsaug,nbcan] = size(Itexaug);
CC = bwconncomp(Iaug);
list = CC.PixelIdxList;
centres = [];
%fid = fopen(nom +"/centrebis"+ nom +".json",'w');
%fprintf(fid,'[');
%premier = true;

for k = 1:length(list)

Pierre1 = list{k};
Pierre = zeros(nblignesaug,nbcolsaug,nbcan);
PierreTex = zeros(nblignesaug,nbcolsaug,nbcan);
for i = 1:length(Pierre1)
    [row,col,can] = ind2sub([nblignesaug nbcolsaug nbcan],Pierre1(i));
    Pierre(row,col,can) = 255;
    PierreTex(row,col,can) = Itexaug(row,col,can);
    
end

PierreTex = uint8(PierreTex);
A =  double(Pierre(:,:,1) ==255);

[Irec,Arec,coinhautgauche] = recadrage(PierreTex,A);
centres = [centres; [coinhautgauche(1) coinhautgauche(2)]];
imwrite(Irec, nom  + '/pierre'+ k +'.png','Alpha',Arec);
%coinhautgauche1 = coinhautgauche(1);
%coinhautgauche2 = coinhautgauche(2);
% if(~premier)
%     fprintf(fid, ',');
% end
% fprintf(fid,'[%i', coinhautgauche1);
% fprintf(fid,',');
% fprintf(fid,'%i ]',coinhautgauche2);
% premier = false;
end
% fprintf(fid,']');
% fclose(fid);

supprdoublonetcoupe(nom,centres,nblignes,nbcols);